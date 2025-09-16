import json
import os
import base64
import getpass
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes

DATA_FILE = "vault.json"

def derive_key(master_password: str, salt: bytes) -> bytes:
    """Derives a key from the master password using PBKDF2"""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100_000,
        backend=default_backend()
    )
    return base64.urlsafe_b64encode(kdf.derive(master_password.encode()))

def load_data():
    if not os.path.exists(DATA_FILE):
        return {}, os.urandom(16)
    with open(DATA_FILE, "r") as f:
        file_data = json.load(f)
        salt = base64.b64decode(file_data["salt"])
        data = file_data["data"]
        return data, salt

def save_data(data, salt):
    with open(DATA_FILE, "w") as f:
        json.dump({
            "salt": base64.b64encode(salt).decode(),
            "data": data
        }, f, indent=4)

def add_password(vault, fernet):
    service = input("Service name: ").strip()
    username = input("Username: ").strip()
    password = getpass.getpass("Password: ").strip()
    encrypted = fernet.encrypt(password.encode()).decode()
    vault[service] = {"username": username, "password": encrypted}
    print(f"[+] Password for {service} added.")

def view_passwords(vault, fernet):
    if not vault:
        print("No entries found.")
        return
    for service, creds in vault.items():
        decrypted = fernet.decrypt(creds["password"].encode()).decode()
        print(f"{service}:")
        print(f"  Username: {creds['username']}")
        print(f"  Password: {decrypted}")
        print()

def search_password(vault, fernet):
    query = input("Search service name: ").strip().lower()
    found = False
    for service, creds in vault.items():
        if query in service.lower():
            decrypted = fernet.decrypt(creds["password"].encode()).decode()
            print(f"{service}:")
            print(f"  Username: {creds['username']}")
            print(f"  Password: {decrypted}")
            found = True
    if not found:
        print("No matching service found.")

def main():
    print("==== Local Password Manager ====")
    master_password = getpass.getpass("Enter master password: ").strip()

    # Load existing data or create new
    vault, salt = load_data()
    key = derive_key(master_password, salt)
    fernet = Fernet(key)

    while True:
        print("\nOptions:")
        print("1. Add password")
        print("2. View all passwords")
        print("3. Search passwords")
        print("4. Exit")
        choice = input("Choose an option: ").strip()

        if choice == "1":
            add_password(vault, fernet)
            save_data(vault, salt)
        elif choice == "2":
            view_passwords(vault, fernet)
        elif choice == "3":
            search_password(vault, fernet)
        elif choice == "4":
            print("Goodbye.")
            break
        else:
            print("Invalid choice.")

if __name__ == "__main__":
    main()