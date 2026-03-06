# Brookhaven 3D — Build Specification

## Architecture
- **Single HTML file**: `index.html` — everything inline (JS, CSS, assets)
- **Renderer**: Three.js r158 via CDN
- **No build tools**: must work via `file://` or static serve
- **Save/load**: localStorage only
- **Target**: 60fps on Mac Mini 16GB, Chrome/Brave

## World Layout (coordinate system: X=east, Z=north, Y=up)
Origin at town centre. Each block ~60 units wide.

### Zones
- **Residential (NW, -300 to -100, -300 to -100)**: 12 unique houses in a grid layout, driveways, fences, trees
- **High Street (centre, -100 to 100, -60 to 60)**: clothing store, grocery store, electronics store, restaurant/café, furniture store, petrol station
- **Civic Centre (NE, 50 to 200, -150 to 0)**: hospital, police station, fire station, school, church
- **Park (east, 100 to 250, 50 to 200)**: paths, benches, playground (swings, slide), fountain, trees
- **Beach (south, -200 to 200, 200 to 350)**: sand, ocean (animated water plane), pier, boats
- **Farm (far NW, -400 to -250, -400 to -200)**: fields, barn, silo, tractor, animals
- **Forest/Mountain (north, -100 to 100, -400 to -200)**: dense trees, hiking trail, mountain peaks
- **Carnival (west, -350 to -150, 50 to 250)**: Ferris wheel, bumper cars, carousel, stalls, ticket booth

## Player System
- Capsule geometry (radius 0.4, height 1.8) with sphere head — simple but readable
- Custom colours: skin (head+hands), shirt, trousers, shoes, hair
- Hair: 10 styles (bob, afro, ponytail, short, long, buzz, curly, bun, mohawk, bald)
- Accessories: glasses, hat (5 styles), bag
- Wardrobe: 25+ tops, 25+ bottoms, 25+ shoes in colour/style combos
- Movement: walk (WASD), run (Shift), jump (Space), swim (auto when in water), sit (F near seat), lie down (F near bed)
- Emotes: E key cycles through: wave, dance (sway), laugh (shake), clap, thumbs up, cry, spin
- Stamina bar (run depletes, replenishes)
- Camera: third-person orbit (mouse drag), scroll to zoom, V to toggle first-person

## Vehicles (10 types)
All use simple physics: velocity + steering angle + friction + gravity.

| ID | Name | Speed | Color | Spawn |
|----|------|-------|-------|-------|
| car | Sedan | 40 | red | High street |
| truck | Pickup | 30 | blue | Residential |
| suv | SUV | 35 | silver | Residential |
| sports | Sports Car | 70 | yellow | Dealership |
| moto | Motorbike | 60 | black | Dealership |
| bike | Bicycle | 15 | green | Park |
| bus | Bus | 25 | orange | Civic |
| ambulance | Ambulance | 45 | white | Hospital |
| police | Police Car | 50 | blue+white | Police Station |
| firetruck | Fire Truck | 35 | red | Fire Station |

- Press E to enter/exit (within 3 units)
- Drive with WASD. Handbrake: Space
- Vehicle stays where player left it
- Petrol station refuels on proximity (auto)
- Player garage at home house: can "store" vehicle

## Buildings & Interiors
Every building: exterior mesh + invisible door trigger zone (2 units). Press E to enter.

### Houses (12 total, each unique exterior colour/shape)
Interior rooms (each ~10x8x3):
- Living room: sofa, coffee table, TV (on/off F), bookshelf, rug
- Kitchen: counter, fridge (open F = food item pickup), cooker (cooking anim F), sink
- Bedroom: bed (F = sleep → skip to next morning), wardrobe (F = open wardrobe UI), desk
- Bathroom: shower (F = water particle effect), toilet, mirror

### Shops
- **Clothing Store**: racks of clothes, fitting room, cashier NPC. F near item = try on, then buy.
- **Grocery Store**: shelves with food items. Pick up (F), auto-adds to inventory.
- **Electronics Store**: displays, TV screens, phone items
- **Furniture Store**: room setups. Buy items for home.
- **Restaurant/Café**: tables, chairs. Sit (F) → order menu → eating animation → restore health
- **Petrol Station**: pump (auto-refuel on enter)

### Civic Buildings
- **Hospital**: reception desk, 4 beds, X-ray machine, ambulance bay. Doctor NPC heals player (restores health to 100).
- **Police Station**: front desk, 2 cells, locker room. Officer NPC patrols.
- **Fire Station**: truck bay, pole (F to slide), alarm panel (F to trigger lights)
- **School**: 2 classrooms with desks, playground area, gym hall
- **Church**: pews, altar, stained glass (colored light shafts)

### Carnival
- **Ferris Wheel**: 8 cars rotating on Y-axis. Press E to board → camera zooms to car view as it rotates
- **Carousel**: 8 horses on up/down sine + rotate. E to ride.
- **Bumper Cars**: 6 bumper car meshes, player drives one while others auto-move. E to enter.
- **Ring Toss stall**: aim reticle, click to throw, score counter
- **Balloon Pop stall**: click balloons for points + prize text
- **Candy floss stand**: NPC vendor, buy item for +5 energy
- **Ticket booth**: exchange currency for ride tickets (10 coins = 1 ticket)

## NPCs (20 total)
Simple box/capsule bodies with coloured materials + name floating above.

Each NPC has:
- Name (string)
- Role (string, shown on approach)  
- Home position + patrol radius
- 3 dialogue lines (cycled on E press)
- Walk animation (slight bob)

NPC list:
1. Maya Chen — Shopkeeper (Clothing Store)
2. James Miller — Police Officer (patrols High Street)
3. Dr Sarah Park — Doctor (Hospital)
4. Tom Bradley — Firefighter (Fire Station)
5. Lisa Wong — Teacher (School)
6. Chef Marco — Restaurant Owner (Café)
7. Officer Dave — Police (Police Station)
8. Nurse Emily — Nurse (Hospital)
9. Bob the Farmer — Farmer (Farm)
10. Penny Lane — Florist (Park)
11. Jake Storm — Mechanic (Petrol Station)
12. Rosa Garcia — Grocery Clerk (Grocery Store)
13. Sam Taylor — Bus Driver (rides bus route)
14. Alex Kim — Student (School area)
15. Mia Roberts — Lifeguard (Beach)
16. Harry Scott — Fisherman (Pier)
17. Zoe Adams — Park Keeper (Park)
18. Dan Fox — Carnival Host (Carnival)
19. Grace Hill — Electronics Store Clerk
20. Max Turner — Delivery Person (drives around)

Patrol: NPCs move between 2-3 waypoints within their zone. Simple lerp movement at ~2 units/sec.
Dialogue: Press E within 3 units. Dialog panel shows name, role, and 3 chat lines that cycle.

## Pets (10 types)
Pet shop at High Street.

| Pet | Mesh | Follow speed |
|-----|------|-------------|
| Dog | Sphere body + 4 box legs | 4 |
| Cat | Similar to dog, smaller | 3.5 |
| Rabbit | Rounded body + long ears | 3 |
| Hamster | Tiny sphere | 2.5 |
| Parrot | Sphere body on sphere head, on shoulder | — (rides on shoulder) |
| Horse | Large box body + 4 legs | 6 |
| Turtle | Flat cylinder + dome | 2 |
| Fish | In bowl (follows floating) | 2 |
| Snake | Segmented spheres | 3 |
| Lizard | Small box lizard shape | 3 |

- Buy in pet shop (100-500 coins per pet)
- Pet follows player (lerp toward player at pet speed)
- F near pet = feed (if food in inventory) → happy animation (bounce)
- Name pet in panel
- Pet accessories: collar (cylinder), bow, outfit (color change)
- Max 1 active pet at a time

## Economy
- Starting balance: $500
- Currency shown in HUD top-left

### Mini-Jobs (each has a job marker in world, yellow ! icon)
1. **Package Delivery** (starts at Post Office beside school): Pick up package (F), deliver to marked house. $50/delivery. 3 packages available, respawn every 5 min.
2. **Lawn Mowing** (starts at any residential house): Stand near lawn + hold F for 5s. $30/lawn. 4 lawns available.
3. **Food Serving** (Restaurant kitchen): Pick up plate (auto when in kitchen), carry to table flashing red. $25/table. Cycle of orders.
4. **Building Cleaning** (School): Walk into dust particles to "vacuum" them. $40/clean. Resets every 10 min.
5. **Fishing** (Pier/Beach): Stand at fishing spot, hold F, wait for bite (3-8s random), press F again. $20-100/fish (random).

### Shops spending
- Clothing: $20-150/item
- Groceries: $5-30/item
- Pets: $100-500
- Carnival tickets: $10/ticket
- Vehicles: Dealership sells cars $500-2000

## Day/Night Cycle
Full cycle = 20 real minutes (10 min day, 10 min night)
- Dawn: orange/pink ambient, fog
- Day: bright directional sun, blue sky
- Dusk: orange/red, long shadows
- Night: dark blue ambient, directional moonlight, stars (particle system), streetlamps ON (PointLights activate), house windows glow (emissive material)
- TimeOfDay stored as 0-1 float, lerp sky color and light intensity

## Weather System
Randomly changes every 5-15 min. Or player can cycle manually.
- **Sunny**: default, clear sky
- **Rain**: 2000 falling white thin lines (LineSegments), puddle decals on ground, rain sound loop, ambient darkens to grey
- **Snow**: 1500 falling white spheres (slow), ground color shifts to white/grey
- **Fog**: Three.js fog density increases, visibility reduced to ~50 units

## HUD (always visible)
Top-left: 💰 Balance | ⚡ Stamina bar | ❤️ Health bar (optional)
Bottom-right: Minimap (orthographic top-down camera, 150x150px canvas element, updates every frame)
Bottom-centre: Emote hint text when emoting
Top-centre: Location name popup when entering a zone (fades after 2s)
Bottom-left: Inventory hotbar (6 slots, shows carried items)

## Pause/Menu System (ESC)
- Resume
- Controls reference
- Settings (volume sliders: music, SFX; graphics: low/medium/high which adjusts shadow map, draw distance, particle count)
- Save Game (localStorage)
- Load Game (localStorage)
- Quit (confirm dialog)

## Map Screen (M key)
Full-screen stylized top-down map showing:
- Zone labels (Residential, Hospital, Park, Beach, etc.)
- Player position dot (animated)
- NPC icons
- Job markers
- Current time of day (clock)

## Wardrobe (C key)
Full panel:
- Left: 3D rotating avatar preview
- Right: category tabs (Tops, Bottoms, Shoes, Hats, Accessories, Skin, Hair)
- Grid of items with preview colour swatches
- Click to equip immediately (avatar updates in real time)

## Audio
- Use Web Audio API oscillators + noise for ambient sounds (no external files needed)
- Footstep: tick sound every 0.4s while walking, 0.25s while running
- Vehicle: oscillator at varying frequency by speed
- Rain: white noise with low-pass filter
- Door: short click sound
- Money pickup: ascending arpeggio
- All volume controlled by settings sliders

## Save/Load (localStorage)
Save object:
```json
{
  "playerPos": [x, y, z],
  "playerRot": float,
  "balance": number,
  "inventory": [],
  "equippedOutfit": {},
  "pet": {name, type, accessories},
  "timeOfDay": float,
  "weather": string,
  "ownedVehicles": [],
  "homeDecor": {}
}
```

## Technical Notes
- Three.js r158 from CDN: https://cdnjs.cloudflare.com/ajax/libs/three.js/r158/three.min.js
- OrbitControls NOT used (custom camera)
- Cannon.js for physics: https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js
- Raycasting for interaction detection
- LOD: beyond 150 units, reduce geometry
- Object pooling for particles (rain/snow) — reuse meshes, just reposition
- Frustum culling (Three.js default): ensure all meshes have frustumCulled = true
- Shadow maps: only sun/moon cast shadows, max 1024x1024 shadow map
- 60fps target: profile and cut if needed
- Mobile: touch joystick (nipple.js from CDN) or on-screen WASD buttons

## File Output
Save as: `/Users/stuartwilson/.openclaw/workspace/projects/brookhaven-rp/index.html`
Single self-contained HTML file, no external dependencies beyond CDN links.
