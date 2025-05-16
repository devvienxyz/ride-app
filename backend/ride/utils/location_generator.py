import random


def generate_coordinates():
    # Weighted locations: DTLA, Santa Monica, Inglewood, Glendale
    zones = [
        (34.0522, -118.2437),  # DTLA
        (34.0195, -118.4912),  # Santa Monica
        (33.9617, -118.3531),  # Inglewood
        (34.1425, -118.2551),  # Glendale
    ]
    center = random.choice(zones)
    lat = round(random.uniform(center[0] - 0.01, center[0] + 0.01), 6)
    lng = round(random.uniform(center[1] - 0.01, center[1] + 0.01), 6)
    return lat, lng
