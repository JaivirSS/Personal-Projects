import pygame
import time
import random
from Coordinates import GridValues
from collections import deque


pygame.init()
car_vel= [1,1]        
NumVehicles= 0
Vehicles = []
Roads = []
Buildings = []
Buttons = []
Special_Buttons = []
UsedCoordinates = []

##################THE GREEN BUTTON IS FOR ROADS, THE PINK BUTTON IS FOR BUILDINGS######################

class Vehicle: #This is the vehicle class
    
    def __init__(self, start, route):
        self.route = route #The route is determined by the building the vehicle spawns from
        self.coordinates = start # the start of the route is the building's coordinates
        Vehicles.append(self) # the vehicle appends itself to the list of vehicles so it can be called by the simulation
        self.car_pos_equal = False #this checks if it is has reached where it needs to go
        self.lastspot = False # this checks if it is on its way to the final destination
        self.RoutePoint = 1 # this is how far along its route it is
        self.velocity = 5 # this is it's initial velocity
        self.aim = self.route[self.RoutePoint] # this is the first aim on its route
        if self.coordinates in sim.VehicleSquares:#} These lines add the car to the dicitionary but first check
            print("line32")                                   #}
            sim.VehicleSquares[self.coordinates].append(self) #} if that space in the dictionary has been initialised by another car or not
        else:                                                 #}
            sim.VehicleSquares[self.coordinates] = [self]     #}
            print("line36")
        if self.coordinates[0] - self.aim[0]> 0:
                    self.x_direction = "left"
        else:
            self.x_direction = "right"
        
        if self.coordinates[1] - self.aim[1] > 0:
            self.y_direction = "down"
        else:
            self.y_direction = "up"
        
        self.car_x_calc = False
        self.car_y_calc = False

    def NewCalcMovement(self):
            
            if not self.car_pos_equal: #if the car has not reached it's final destination
                car_x = self.coordinates[0]
                car_y = self.coordinates[1]
                self.aim = self.route[self.RoutePoint] # the next aim point is the next point on the route   
                print(f"line 56 {self.aim}")
                if self.coordinates != [self.aim[0]-10, self.aim[1]-10]: # accounts for the fact that circles are drawn from the centre while squares are drawn from the corner
                    if car_x != (self.aim[0]-10): # if the x coordinate is not correct
                        car_x_calc = False
                        print("line 47 car_x_calc is false")
                        # while not car_x_calc:
                        if car_x > (self.aim[0]-10):
                            car_x -= self.velocity
                        elif car_x < (self.aim[0]-10):
                            car_x += self.velocity
                        else:
                            pass

                            print(f"line 56 car_x = {car_x}")

                            if (car_x == (car_x-1)) or (car_x == (car_x + 1)):
                                car_x_calc = True
                                print(car_x)
                                print(car_x -1)
                                print(car_x +1)
                                print("line 60 car_x_calc is true")
                            else:
                                print(car_x)
                                print(car_x -1)
                                print(car_x +1)
                                print("line 62 car_x_calc is False")

                    if car_y != (self.aim[1]-10): # if the y coordinate is not correct
                        car_y_calc = False
                        while not car_y_calc:
                            if car_y > self.aim[1]-10:
                                car_y-= self.velocity
                            elif car_y < self.aim[1]-10:
                                car_y += self.velocity
                            else:
                                pass

                            if car_y == (car_y-1) or (car_y +1):
                                car_y_calc = True
                        
                    if [car_x, car_y] == [(self.aim[0]-10), (self.aim[1]-10)]: # if both coordinates are correct
                        
                        if self.lastspot: # If we are at the end of the route
                            self.car_pos_equal = True # complete the route
                            Vehicles.remove(self)
                        else:
                            self.RoutePoint += 1 # else move to the enxt aimpoint
                        
                        if self.route[self.RoutePoint] == self.route[-1]: # check if we are onto the last aimpsot
                            self.lastspot = True

                    car_position= [car_x, car_y]
                    sim.VehicleSquares[self.coordinates].remove(self)
                    self.coordinates = tuple(car_position) # update vehicle position
                    if self.coordinates in sim.VehicleSquares:
                        sim.VehicleSquares[self.coordinates].append(self)
                    else:
                        sim.VehicleSquares[self.coordinates] = [self]

    def NewCalcMovement1(self):
        car_x = self.coordinates[0]
        car_y = self.coordinates[1]
        self.aim = self.route[self.RoutePoint]
        if self.x_direction == "left":
            if car_x > self.aim[0]:
                car_x -= self.velocity
            if car_x <= self.aim[0]:
                self.car_x_calc  = True

        elif self.x_direction == "right":
            if car_x < self.aim[0]:
                car_x -= self.velocity
            if car_x >= self.aim[0]:
                self.car_x_calc = True
        
        if self.y_direction == "up":
            if car_y > self.aim[1]:
                car_y -= self.velocity
            if car_y <= self.aim[1]:
                self.car_y_calc = True
        
        elif self.y_direction == "down":
            if car_y < self.aim[1]:
                car_y -= self.velocity
            if car_y >= self.aim[1]:
                self.car_y_calc = True
        
        if self.car_x_calc and self.car_y_calc:
            if self.lastspot:
                Vehicles.remove(self)
            else:
                self.RoutePoint += 1
                if car_x - self.route[self.RoutePoint][0] > 0:
                    self.x_direction = "left"
                else:
                    self.x_direction = "right"
                
                if car_y - self.route[self.RoutePoint][1] > 0:
                    self.y_direction = "down"
                else:
                    self.y_direction = "up"
            
            self.car_x_calc = False
            self.car_y_calc= False
        
        if self.route[self.RoutePoint] == self.route[-1]:
            self.lastspot = True
        
        car_position= [car_x, car_y]
        sim.VehicleSquares[self.coordinates].remove(self)
        self.coordinates = tuple(car_position) # update vehicle position
        if self.coordinates in sim.VehicleSquares:
            sim.VehicleSquares[self.coordinates].append(self)
        else:
            sim.VehicleSquares[self.coordinates] = [self]

    
    def NewVelocityCheck(self): # SUPPOSED TO CHANGE VELOCITY BASED ON CAR IN FRONT BUT HAS BARELY BEEN WRITTEN
        if self.aim in sim.VehicleSquares:
            print("line 197")
            print(f"line 200 self.velocity is {self.velocity}")
            print(f"line 92 {len(sim.VehicleSquares[self.aim])}")
            if len(sim.VehicleSquares[self.aim]) != 0:
                print(f"line 178 {sim.VehicleSquares[self.aim]}")
                print("line 199")
                print(f"line202 self.velocity is {self.velocity}")
                self.velocity = self.velocity - 1
                print(f"self.velocity is {self.velocity}")
                if self.aim.junction:
                    self.velocity -= 1
                    print("line102 self.junction is true")
        print(sim.CoordsToRoad[self.aim])
        if sim.CoordsToRoad[self.aim].junction:
                self.velocity = self.velocity - 1
                print(f"line 108 self.velocity is {self.velocity}")
                print("line102 self.junction is true")
            # elif self.velocity != 5:
            #     self.velocity += 1
        else:
            print("line 195 it is not a junction")

class Simulation: # this is where all the values are calculated

    def __init__(self):
        self.SetDefault()


    def SetDefault(self):
        self.roads = [] # creates the list of roads
        self.NewRoadmap = dict() # creates the graph of the roadmap
        self.BuildingCoordinates = dict() # creates the dictionary of building spaces
        self.VehicleSquares = dict() # creates the dictinoary of where the vehicles are
        self.CoordsToRoad = dict()
    
    def Update(self):
        Simulation.UpdateBuildings()
        Simulation.UpdateVehicles()

    def UpdateVehicles():
        for vehicle in Vehicles:
            Vehicle.NewVelocityCheck(vehicle)
            Vehicle.NewCalcMovement1(vehicle)

    def UpdateBuildings():
        for building in Buildings:
            Building.Update(building)

    def UpdateRoads():
        for road in Roads:
            Road.Update(road)


class Building:
    def __init__(self, coordinatesForBuilding):
        self.coordinates = coordinatesForBuilding # the coordinates handed to it are made the building coordinates
        sim.BuildingCoordinates[self.coordinates] = self # adds itself to the dictionary of buildings
        UsedCoordinates.append(self.coordinates) # adds itself to the list of used coordinates
        self.generation_rate = 0 # sets its generation rate for generating vehicles to 0
        self.dest_given = False # shows whether it has chosen a destination building or not
        self.connected = False # shows whether it is connected to its chosen destination
        sim.NewRoadmap[self.coordinates] = [] # adds itself to the graph of the roadmap
        self.route = [] # initialises the route list so it can create one later
        Buildings.append(self) # adds itself to te list of buildings
        self.DestinationChoice() # decides its destination
        self.NewConnectedCheck() # checks what roads it is immediately connected to and updates the graph with this information
        self.FindRoute() # calculates a route to its destination and checks whether it isa complete route 
    
    def Update(self):
        if self.dest_given and self.connected: # if it is connected to its destination
            if self.generation_rate % 500 == 0: # start generating vehicles
                Vehicle(self.coordinates, self.route)
            self.generation_rate += 1

        else:
            self.DestinationChoice()
        
    def DestinationChoice(self):
        if len(Buildings) > 1: # if it is not the the only building
            while not self.dest_given: # while a valid destination has not been chosen
                self.destination = random.choice(Buildings) # choose one
                if self.destination != self: # if it didn't choose itself as the destination
                    self.dest_given = True # set dest_given to True

    def FindRoute(self): # finds a route between the destination and the building
        if self.dest_given: # if a destination has been chosen
            self.route = Building.CalculateRoute(sim.NewRoadmap, self.coordinates, self.destination.coordinates) # returns the route
            if self.route: # if a route has been returned
                if self.route[-1] == self.destination.coordinates: # if the route is complete
                    self.connected  = True
        
    def NewConnectedCheck(self): # checks what connections the building has and updates the graph with this information
        for coordinates in UsedCoordinates: # runs through the coordinates that have been occupied
            if ((self.coordinates[0]-20, self.coordinates[1]) == coordinates) or ((self.coordinates[0] + 20, self.coordinates[1]) == coordinates) or ((self.coordinates[0], self.coordinates[1] -20) == coordinates) or ((self.coordinates[0], self.coordinates[1]+20) == coordinates): # checks if they are beside the building
                if coordinates not in sim.NewRoadmap[self.coordinates]: # if the graph has not already been updated with this information                              
                    sim.NewRoadmap[self.coordinates].append(coordinates)
                    sim.NewRoadmap[coordinates].append(self.coordinates)

    def CalculateRoute(graph, start, end): # calculates the shortest route
        visited = set()
        queue = deque([(start, [start])])

        while queue:
            current, path = queue.popleft()
            visited.add(current)

            if current == end:
                return path

            for neighbor in graph.get(current, []):
                if neighbor in Buildings and neighbor != end:
                    pass
                elif neighbor not in visited:
                    queue.append((neighbor, path + [neighbor]))

        return None

class Road:
    def __init__(self, coordinates):
        self.coordinates = coordinates # sets coordinates to the coordinates that were hadnded in
        self.start = self.coordinates[0] 
        self.end = self.coordinates[-1]
        self.junction = False # junction marker
        Roads.append(self) # adds it to the list of roads
        for coordinates in self.coordinates:
            sim.NewRoadmap[coordinates] = [] # initialises each coordinate space on the roadmap graph
        for coordinates in self.coordinates:
            UsedCoordinates.append(coordinates) # adds each coordinates space to the list of occupied coordinates
        for coordinates in self.coordinates:
            sim.CoordsToRoad[coordinates] = self
        self.NewCheckConnections()

    def NewCheckConnections(self): # checks what connections the road has
        
        for coordinates in self.coordinates: # runs through each coordinate in the road
            road_connections = 0
            left = (coordinates[0]-20, coordinates[1])
            right = (coordinates[0]+20, coordinates[1])
            above = (coordinates[0], coordinates[1]-20)
            below = (coordinates[0], coordinates[1]+20)
            all_checks = [left, right, above, below] # creates a list of all possible connections
        
            for NewCoordinates in UsedCoordinates:
                for check in all_checks:
                    if NewCoordinates == check: # checks if any of the coordinates in the list of occupied coordinates are equal to any of the checks
                        if NewCoordinates not in sim.NewRoadmap[coordinates]: # if the coordinate space has not already been added to the roadmap then add it
                            sim.NewRoadmap[coordinates].append(NewCoordinates)
                            sim.NewRoadmap[NewCoordinates].append(coordinates)
                            if NewCoordinates in sim.BuildingCoordinates: # if the connection is to a building
                                sim.BuildingCoordinates[NewCoordinates].FindRoute() # make the building recalculate its route as a shorter route may now be possible
                            else:
                                road_connections += 1
            
            if road_connections > 2:
                self.junction = True
                print("line138 self.junction is true")


class Button:
    def __init__(self, coordinates):
        self.SetDefault(coordinates)
    def SetDefault(self, coordinates):
        self.coordinates = coordinates
        self.rect = pygame.rect.Rect((coordinates[0]-10, coordinates[1]-10),(15,15))
        Buttons.append(self)

class Special_Button():
    def __init__(self, coordinates, colour, button_type):
        self.SetDefault(coordinates, colour, button_type)
    
    def SetDefault(self, coordinates, colour, button_type):
        self.colour = colour
        self.rect = pygame.rect.Rect(coordinates,(30,30))
        self.pressed = False
        self.type = button_type
        Special_Buttons.append(self)

class Window:
    def __init__(self, sim): #Initialises the window class and passes it the simulation
        self.sim = sim

        self.SetDefault()

    def SetDefault(self): #sets all the defaults for the window
        self.width = 1400
        self.height = 800
        self.fps = 60

    def draw_buttons(self):
        for button in Special_Buttons:
            pygame.draw.rect(self.window, button.colour, button.rect)

    def draw_roads(self): # Goes throguh the list of roads and draws them
        for road in Roads:
            for i in road.coordinates:
                pygame.draw.rect(self.window, (255,0,0), (i[0]-10, i[1]-10, 20, 20))
    
    def draw_vehicles(self):
        for vehicle in Vehicles:
            pygame.draw.circle(self.window, (0,255,0), (vehicle.coordinates[0]+10, vehicle.coordinates[1]+10), 10)

    def draw_buildings(self):
        for building in Buildings:
            pygame.draw.rect(self.window, (0,255,255), (building.coordinates[0]-10, building.coordinates[1]-10, 20, 20))

    def draw(self): #draws all the stuff for the window
        self.window.fill((0,0,0))
        pygame.draw.rect(self.window, (234,108,221), (10,10,10,10))

        self.draw_roads()
        self.draw_vehicles()
        self.draw_buildings()
        self.draw_buttons()

    def loop(self): #Runs the game loop
        self.window = pygame.display.set_mode((self.width, self.height))
        pygame.display.flip()
        
        clock = pygame.time.Clock()

        
        running = True
        dragging = False
        button_pressed = False
        tiletype = ""
        building_button = Special_Button((60,600), (245,200,199), "building")
        road_button = Special_Button((100, 600), (60,100,60), "road")
        for coordinates in GridValues:
            Button((coordinates[0], coordinates[1])) 
        while running:
            # if loop: loop(self.sim)

            Simulation.Update(self.sim)
            self.draw()

            pygame.display.update()
            clock.tick(self.fps)

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                
                elif event.type == pygame.MOUSEBUTTONDOWN: # start the dragging motion when the mouse is clicked
                    for button in Special_Buttons:
                        pos = pygame.mouse.get_pos()
                        if button.rect.collidepoint(pos):
                            tiletype = button.type
                            button_pressed = True
                    if not button_pressed:
                        dragging = True
                    
                    PlannedRoad = []
                
                elif event.type == pygame.MOUSEBUTTONUP: # when the mouse  button comes back up create buildings/roads where it was dragegd
                    dragging = False
                    button_pressed = False
                    if len(PlannedRoad) > 0:
                        PlannedRoad1 = []
                        for coordinates in PlannedRoad:
                            if coordinates not in PlannedRoad1:
                                PlannedRoad1.append(coordinates)
                        if tiletype == "road":
                            Road(PlannedRoad1)
                        elif tiletype == "building":
                            for coordinates in PlannedRoad1:
                                Building(coordinates)
                
                elif event.type == pygame.MOUSEMOTION: # if the mouse is being dragged while the button is clicked
                    if dragging:
                        pos = pygame.mouse.get_pos() #gets the position of the mouse
                        for button in Buttons:
                            if button.rect.collidepoint(pos):
                                PlannedRoad.append(button.coordinates)

##################THE GREEN BUTTON IS FOR ROADS, THE PINK BUTTON IS FOR BUILDINGS######################
                        
sim = Simulation()
win = Window(sim)
Window.loop(win)

pygame.quit()
