from __future__ import division 

# 409
#424.8668

def find_distance(time):

    c = 3e8 # speed of light
    # get distance
    distance = c * time / 2 
    print(distance)
    return distance

def find_square(distance, beacon):
    top_left = [beacon[0] - distance, beacon[1] + distance]
    top_right = [beacon[0] + distance, beacon[1] + distance]
    bottom_left = [beacon[0] - distance, beacon[1] - distance]
    bottom_right = [beacon[0] + distance, beacon[1] - distance]
    return [top_left, top_right, bottom_left, bottom_right] 

def line(p1, p2):
    A = (p1[1] - p2[1])
    B = (p2[0] - p1[0])
    C = (p1[0]*p2[1] - p2[0]*p1[1])
    return A, B, -C

def intersection(L1, L2):
    D  = L1[0] * L2[1] - L1[1] * L2[0]
    Dx = L1[2] * L2[1] - L1[1] * L2[2]
    Dy = L1[0] * L2[2] - L1[2] * L2[0]
    if D != 0:
        x = Dx / D
        y = Dy / D
        return x,y

def find_center(point1, point2):
    x = (point1[0] + point2[0]) / 2
    y = (point1[1] + point2[1]) / 2
    return [x, y]

# cordinates / location of beacons -> these get plotted onto grid
beacon1 = [1280,1080] 
beacon2 = [1250, 550]
beacon3 = [2000, 700]

# time values from pings sent to each beacon
time1 = 0.0000011 #14533e-9 
time2 = 0.00000456 #5107e-9
time3 = 0.0000090855 #6027e-9

# get distance from each time
d1 = find_distance(time1)
d2 = find_distance(time2)
d3 = find_distance(time3)


s1 = find_square(d1, beacon1)
s2 = find_square(d2, beacon2)
s3 = find_square(d3, beacon3)

tsbr = intersection(line(s1[1], s1[3]), line(s3[2], s3[3]))
tsbl = intersection(line(s2[0], s2[2]), line(s3[2], s3[3]))
tstr = intersection(line(s1[1], s1[3]), line(s2[0], s2[1]))
tstl = s2[0]

target = find_center(tstl,tsbr)
tx = str(round(target [0]))
ty = str(round(target[1]))

print("Target is at (" + tx + ", " + ty + ")")