

class Tracking():
    ''' Tracking class:
        Function's used to perform min-max triangulation calculations:

    '''

    # cordinates / location of beacons -> these get plotted onto grid
    beacon1 = [1280,1080] 
    beacon2 = [1250, 550]
    beacon3 = [2000, 700]


    def rssi_to_distance(rssi: int) -> int:
        ''' Condtional to get appr. distance value from RSSI: '''

        distance = (rssi + 55.5) / -0.1357 # function found through testing:
        
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