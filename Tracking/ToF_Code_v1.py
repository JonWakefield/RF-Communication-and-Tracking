from __future__ import division 

def find_distance(time):
    c = 3e8
    distance = c * time / 2
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

beacon1 = [-2070,-680]
beacon2 = [331, -679]
beacon3 = [332, 830]

time1 = 14533e-9
time2 = 5107e-9
time3 = 6027e-9

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