import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { User } from "../../models/models";
import { getUsers } from "../../http/users/users";

interface id {
  [key: number]: boolean;
}

function removeDuplicates(users: User[]) {
  const added: id = {};
  const newList: User[] = [];
  for (const u of users) {
    if (!added[u.id]) {
      newList.push(u);
      added[u.id] = true;
    }
  }
  return newList;
}

type props = {
  value: User[];
  setValue: Dispatch<SetStateAction<User[]>>;
};

export default function UserSelect({ value, setValue }: props) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<readonly User[]>([]);
  //const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!inputValue) {
      setOptions([]);
      return;
    }
    fetchUsers(inputValue);
    async function fetchUsers(username: string) {
      try {
        //setLoaded(false);
        const users = await getUsers(username);
        setOptions(users);
      } catch (error) {
        alert("failed to fetch users");
      }
      //setLoaded(true);
    }
  }, [inputValue]);

  return (
    <Autocomplete
      sx={{ width: 300 }}
      multiple
      className=""
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.username
      }
      filterOptions={(x) => x}
      //slots={{
      //  paper: CustomPaper,
      //}}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No users"
      onChange={(_: any, newValue: User[]) => {
        setOptions(newValue ? removeDuplicates(newValue) : options);
        setValue(removeDuplicates(newValue));
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Add a user"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary-border)",
                borderWidth: 2,
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary-border)",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "var(--secondary-text)",
            },
            "& .MuiInputBase-input": {
              color: "var(--primary-text)",
            },
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps} className="">
            <div className="p-2 cursor-pointer hover:bg-gray-300">
              <h3 className="font-bold ">{option.username}</h3>
              <h5 className="font-light text-sm">{option.email}</h5>
            </div>
          </li>
        );
      }}
    />
  );
}
