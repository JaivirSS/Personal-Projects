coordinates = []
y_coordinates = []
x_coordinates = []
initial_x = 1410
initial_y = 10
#for loop in range(40):
#    y_coordinates.append(y)
#    y += 20
#print(y_coordinates)

for X in range(10):
    for Y in range(40):
        new_coordinates = [initial_x, initial_y]
        coordinates.append(new_coordinates)
        initial_y += 20
    initial_x += 20
    initial_y = 10
print(coordinates)
