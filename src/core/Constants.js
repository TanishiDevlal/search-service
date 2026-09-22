export const RESPONSE_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    FAIL: 'fail'
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

export const SERVER_CONFIG = {
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
};

export const machineKeyword = {
    "Excavator": [
        "excavator", "poclain", "poklen", "poklan", "hitachi", "tata hitachi", "hyundai excavator",
        "digger", "crawler machine", "rock breaker", "bucket", "auger", "PC200", "PC210", "mini excavator", "chota poclain",
        "badi poclain", "20 ton excavator", "14 ton excavator", "mining excavator", "JCB excavator", "Kobelco",
        "Komatsu", "Sany excavator", "Volvo excavator", "chain wali machine", "mitti nikalne ki machine",
        "gadda khodne wali machine", "pathar todne ki machine", "hydraulic excavator", "track machine",
        "long arm excavator", "long reach", "amphibious excavator", "swamp excavator", "wheeled excavator",
        "tyre wala poclain", "canal cleaning machine", "river machine", "desilting machine", "nadi safai machine",
        "nala safai machine", "talab safai machine", "demolition machine", "building todne ki machine",
        "zero tail swing", "tunnel excavator", "mini poklan", "chhoti poklan", "3 ton excavator", "5 ton excavator",
        "7 ton excavator", "30 ton excavator",
        "rock breaker machine", "breaker with poclain", "poclain with hammer", "excavator on rent", "poclain kiraye par",
        "sand loading machine", "crusher loading machine", "NXT 140", "NXT 205", "EX130", "Hitachi EX", "CAT excavator",
        "quarry machine", "khadan ki machine", "gehri khudai machine", "basement excavator", "foundation excavator"
    ],
    "Backhoe Loader": [
        "JCB", "JCB machine", "khudai machine", "digging machine", "loader JCB", "backhoe", "JCB digger", "breaker JCB", "JCB hammer", "thokne wali machine", "JCB 3DX", "JCB 4DX",
        "JCB 2DX", "JCB kiraye par", "gadda khodne ki machine", "nali khodne ki machine", "mitti ki machine", "JCB wala", "earth mover", "pit machine", "trencher", "foundation digger", "road machine",
        "trench digger", "pipe laying machine", "construction machine", "backhoe digger", "JCB rental", "JCB on rent", "JCB hire", "backhoe on hire", "khudai ka kaam", "nali machine", "naali machine",
        "JCB 3DX Plus", "JCB 3DX Super", "CAT 424", "Tata Hitachi Shinrai", "Case 770", "Mahindra EarthMaster", "Bull Grandia",
        "Escorts Digmax", "sewer line machine", "cable laying machine", "backhoe loader on rent", "JCB with breaker",
        "JCB with hammer"
    ],
    "crane": [
        "crane", "hydra", "hydra crane", "mobile crane", "lifting crane", "boom crane", "chain pulley", "heavy lift", "hook crane", "farana",
        "farana crane", "pick and carry crane", "truck crane", "crawler crane", "tower crane", "RT crane", "rough terrain crane",
        "all terrain crane", "hydraulic crane", "ACE crane", "Escorts crane", "12 ton crane", "14 ton crane", "16 ton crane",
        "20 ton crane", "25 ton crane", "50 ton crane", "100 ton crane", "200 ton crane", "uthane ki machine",
        "pipe uthane wali crane", "khamba lagane wali crane", "maal uthane ki crane", "chhoti crane", "badi crane",
        "bhari crane", "lattice boom crane", "telescopic crane", "360 crane", "slew crane", "NX crane", "wind turbine crane",
        "power plant crane", "refinery crane", "bridge crane", "piling crane", "tower uthane ki crane", "building wali crane",
        "T wali crane", "luffing crane", "hammerhead crane", "flat top crane",
        "loader crane", "knuckle boom", "hiab crane", "truck pe lagi crane", "self loading crane",
        "eent uthane wali crane", "sariya uthane wali crane", "Palfinger", "Hyva", "Fassi", "Sany crane", "Zoomlion crane",
        "XCMG crane", "Liebherr crane", "Tadano", "Potain", "ACE Hydra", "ACE FX", "Kobelco crane", "crane on rent",
        "crane hire", "crane rental", "heavy lifting", "erection crane", "installation crane", "AC crane", "concrete block crane",
        "pul banane ki crane", "flyover crane", "metro crane", "khadi crane", "chain wali crane"
    ],
    "Boom Lift (Self-Propelled)": [
        "boom lift", "man lift", "basket lift", "cherry picker", "aerial lift", "high reach machine", "jib boom", "Z boom",
        "S boom", "articulating boom lift", "telescopic boom lift", "self propelled boom lift", "AWP", "MEWP",
        "aerial work platform", "height machine", "painting machine", "upar jane ki machine",
        "height pe kaam karne ki machine", "hawa mein uthane wali machine", "oonchi machine",
        "overhead machine", "JLG boom lift", "Genie boom lift", "Haulotte", "Dingli", "Zoomlion lift",
        "Manitou lift", "Sinoboom", "12m lift", "15m lift", "20m lift", "26m lift", "40m lift",
        "boom lift on rent", "boom lift hire", "boom lift rental", "refinery lift", "maintenance lift",
        "construction lift", "warehouse lift", "airport lift", "bridge inspection lift", "sky worker", "man basket",
        "cradle machine", "facade cleaning lift", "building maintenance lift", "stadium lift", "tower inspection", "sky"
    ],
    "Scissor Lift": [
        "scissor lift", "table lift", "platform lift", "electric lift", "indoor lift", "kainchi lift", "table wali lift", "upar niche hone wali lift", "warehouse ki machine", "ceiling machine", "slab scissor", "rough terrain scissor", "RT scissor", "electric scissor lift", "diesel scissor lift", "JLG scissor lift", "Genie scissor lift", "Skyjack", "Haulotte scissor",
        "Dingli scissor", "6m scissor", "8m scissor", "10m scissor", "12m scissor", "14m scissor",
        "scissor lift on rent", "indoor scissor", "outdoor scissor", "bi-energy scissor", "compact scissor",
        "wide scissor", "mall lift", "airport lift", "painting lift", "HVAC lift", "ducting lift", "cleaning lift",
        "elevator lift", "industrial lift", "scissor lift hire", "scissor lift rental"
    ],
    "Spider Lift": [
        "spider lift", "compact lift", "narrow lift", "indoor boom lift", "tracked lift", "atrium lift", "mall lift",
        "tracked boom lift", "spider crane", "tracked platform", "makdi lift", "hotel lobby lift", "patli gali wali lift",
        "andar ki lift", "narrow access lift", "glass dome lift", "Teupen", "Falcon", "Hinowa", "Platform Basket", "CMC",
        "Palazzani", "Omme", "spider lift on rent", "confined space lift", "sensitive floor lift", "marble floor lift",
        "tile floor lift", "shopping mall lift",
        "airport atrium lift", "church lift", "15m spider", "20m spider", "30m spider", "50m spider"
    ],
    "Concrete Pump": [
        "concrete pump", "boom pump", "cement pump", "RCC pump", "pipeline pump", "slab pump", "stationary pump", "line pump",
        "boom placer", "truck pump", "concrete boom", "36m pump", "43m pump", "mixer pump", "PUMI", "FBP", "placing boom",
        "shotcrete pump", "tunnel pump", "pump machine", "cement dalne ki machine", "chhat ki machine", "konkrit pump",
        "floor pump", "boom wali pump", "lambi pipe wali pump", "flyover ki pump", "metro pump", "badi pump", "chhota pump",
        "gaon ki pump", "building pump", "high rise pump", "Schwing Stetter", "Putzmeister", "Aquarius", "Ajax", "Sany pump", "Zoomlion pump",
        "KYB Conmat", "concrete pump on rent", "slab casting pump", "RCC casting", "cement pumping", "boom pump on rent", "pump hire", "20m pump", "36m pump", "50m pump",
        "SP 1400", "BSA 1404", "S36X", "M36", "city pump", "self climbing boom", "SPB", "placing boom hire"
    ],
    "Paver": [
        "paver machine", "road paver", "asphalt machine", "road making machine", "sensor paver", "mechanical paver", "asphalt paver",
        "road laying machine", "finisher", "tar machine", "asphalt finisher", "road finisher", "paving machine",
        "sadak banane ki machine", "tar dalne ki machine", "karpet machine", "road banane ki machine", "sadak ki machine",
        "wheeled paver", "tracked paver", "crawler paver", "slipform paver", "concrete paver", "PQC paver", "cement road paver",
        "curb machine", "gutter machine", "divider machine", "runway paver", "Ammann Apollo", "Vogele", "Dynapac paver", "Volvo paver",
        "Sany paver", "LeeBoy", "Wirtgen", "Gomaco", "Power Curbers", "AP 550", "AP 600", "Super 1400", "Super 1800", "paver on rent",
        "road construction machine", "highway paver",
        "village road paver", "PMGSY paver", "NHAI paver", "DLC paver", "WMM paver", "black top machine"
    ],
    "Bitumen Sprayer": [
        "bitumen sprayer", "tar sprayer", "road oil spray", "tanker sprayer", "emulsion sprayer", "tack coat machine", "prime coat machine", "asphalt sprayer", "road sprayer", "tar tanker", "bitumen distributor", "hot sprayer", "tar boiler", "tar wali gaadi", "bitumen gaadi", "kali tel wali machine", "sadak pe tar dalne ki machine", "pothole repair machine", "garam tar machine", "truck mounted sprayer", "trolley mounted sprayer", "tractor mounted sprayer", "sensor sprayer", "hydrostatic sprayer", "4000 liter sprayer", "6000 liter sprayer", "10000 liter sprayer", "Atlas sprayer", "Kaushik sprayer", "Speedcrafts", "Wirtgen Streumaster", "Ammann Apollo sprayer", "cold mix sprayer", "emulsion distributor", "patch work machine", "pothole machine", "bitumen sprayer on rent", "tar distributor", "road tar machine", "pothole"
    ],
    "compactor": [
        "roller", "road roller", "compactor", "soil compactor", "vibratory roller", "single drum roller", "tandem roller", "double drum roller", "PTR", "pneumatic roller", "rubber tyre roller", "static roller", "3 wheel roller", "walk behind roller", "mini roller", "plate compactor", "vibratory plate", "tamper", "rammer", "jumping jack", "wacker", "landfill compactor", "roda", "zameen dabane ki machine", "mitti dabane ki machine", "vibration roller", "finish roller", "tar roller", "asphalt roller", "baby roller", "chota roller", "purana roller", "teen pahiye wala roller", "haath ka roller", "plate machine", "paver block machine", "flooring machine", "wacker machine", "kudne wali machine", "tyre wala roller", "rubber roller", "kachra roller", "JCB roller", "Hamm roller", "Dynapac roller", "Volvo roller", "Case roller", "L&T roller", "Sany roller", "10 ton roller", "11 ton roller", "3 ton roller", "soil roller", "highway roller", "WMM roller", "compactor on rent", "roller on rent", "roller hire", "116D", "Hamm 311", "CA 250", "CC 4200", "HD 99", "VMT 860", "GRW 280", "Bomag", "Wacker Neuson", "Jaypee", "Greaves", "seal roller"
    ],
    "Dozer": [
        "bulldozer", "dozer", "mitti hatane wali machine", "push machine", "blade machine", "bull", "D6", "D7", "D8", "D9", "D10", "D11", "land leveler", "crawler dozer", "mining dozer", "chain dozer", "earth pusher", "jungle cutter", "land clearing machine", "zameen barabar karne ki machine", "dhakka machine", "pathhar dhakane wali machine", "coal mine dozer", "BEML dozer", "CAT dozer", "Komatsu dozer", "Shantui dozer", "LiuGong dozer", "BD80", "BD155", "BD355", "D65", "D155", "SD16", "SD22", "SD32", "swamp dozer", "waste dozer", "wheel dozer", "bulldozer on rent", "dozer hire", "mining machine", "airport dozer", "dam dozer", "road dozer", "ripping machine", "ripper dozer"
    ],
    "Motor Grader": [
        "grader", "road leveling machine", "leveling machine", "motor grader", "road grader", "blade grader", "surface grader", "road finishing machine", "road scraper", "sadak banane ki machine", "sadak level karne ki machine", "sadak sudharne ki machine", "road machine", "CAT grader", "CAT 120", "CAT 140", "Komatsu grader", "GD535", "Sany grader", "STG170", "Mahindra RoadMaster", "BEML grader", "BG605", "Leeboy", "ACE grader", "12 ft blade", "14 ft blade", "highway grader", "NHAI grader", "PMGSY grader", "village road grader", "grader on rent", "grader hire", "GSB spreading machine", "wet mix machine", "road shoulder machine"
    ],
    "Wheel Loader": [
        "loader",
        "front loader", "bucket machine", "mitti bharne wali machine", "grapple attachment", "wheel loader",
        "payloader", "pay loader", "scoop", "loading machine", "material handler", "coal loader", "sand loader", "crusher loader",
        "aggregate loader", "pathhar loader", "gitti loader", "reti loader", "JCB loader", "JCB 433", "JCB 437", "SDLG", "LiuGong",
        "Tata Hitachi loader", "CAT loader", "CAT 950", "CAT 966", "CAT 988", "Komatsu loader", "Volvo loader", "XCMG loader", "coalbucket", "high dump loader", "RMC loader", "batching plant loader", "3 ton loader", "5 ton loader", "loader on rent",
        "loader hire", "tipper loading machine", "crusher plant loader", "quarry loader", "port loader"
    ],
    "Piling Rig": [
        "piling machine", "pile machine", "foundation drilling", "rotary drill", "piling rig", "boring rig", "drilling rig", "rotary rig", "foundation rig", "bore pile machine", "auger rig", "RDR", "bored pile", "CFA rig", "continuous flight auger", "pile driver", "pile hammer", "solar piling rig", "micro piling rig", "tripod rig", "DMC rig", "diaphragm wall grab", "D-wall", "boring machine", "neev ki machine", "foundation machine", "pile thokne ki machine", "solar machine", "khamba thokne ki machine", "desi boring machine", "teen tangri", "Sany piling", "SR155", "SR235", "SR285", "Soilmec", "Bauer BG", "Mait HR", "XCMG XR", "Casagrande", "Zoomlion piling", "metro piling", "flyover piling", "bridge piling", "high rise piling", "piling on rent", "piling rig hire", "solar park machine", "anchor drill", "slope stabilizer", "retaining wall machine", "deep foundation machine", "Junttan", "Banut", "Klemm", "Comacchio"
    ],
    "TeleHandler": [
        "telehandler", "telescopic handler", "boom forklift", "fork attachment", "loadall", "JCB loadall", "material handler", "telescopic forklift", "reach forklift", "construction forklift", "roto telehandler", "lambi bhuja wali forklift", "material uthane ki machine", "building pe maal dalne ki machine", "lambi forklift", "JCB 520", "JCB 530", "JCB 540", "Manitou telehandler", "CAT telehandler", "Bobcat telehandler", "Dieci", "Magni", "JLG telehandler", "man basket", "pallet forks", "loader bucket", "crane hook", "telehandler on rent", "telehandler hire", "7m telehandler", "10m telehandler", "14m telehandler", "17m telehandler", "20m telehandler", "rotating telehandler", "roto handler", "heavy telehandler", "electric telehandler", "refinery telehandler", "warehouse telehandler", "construction handler"
    ],
    "Forklift": [
        "forklift", "fork lift", "pallet truck", "lifting machine", "godown lift", "warehouse forklift", "diesel forklift", "electric forklift", "battery forklift", "3 ton forklift", "5 ton forklift", "10 ton forklift", "maal uthane ki gaadi", "godown ki gaadi", "factory forklift", "pallet gaadi", "reach truck", "VNA truck", "stacker", "electric stacker", "hand pallet truck", "HPT", "BOPT", "pallet jack", "jack", "pump truck", "Godrej forklift", "Toyota forklift", "ACE forklift", "Voltas forklift", "Hyundai forklift", "Linde forklift", "Jungheinrich", "BYD forklift", "Yale", "Doosan", "rough terrain forklift", "3 wheel forklift", "counterbalance", "narrow aisle forklift", "cold storage forklift", "container forklift", "port forklift", "forklift on rent", "forklift hire", "forklift rental", "chhota forklift", "battery stacker", "walkie stacker", "order picker", "high bay forklift", "rack forklift"
    ],
    "Tractor": [
        "tractor", "farming tractor", "kheti wala tractor", "trolley tractor", "farm tractor", "haulage tractor", "4WD tractor", "mini tractor", "compact tractor", "orchard tractor", "chhota tractor", "kisan tractor", "Mahindra tractor", "Swaraj tractor", "John Deere tractor", "New Holland tractor", "Eicher tractor", "Farmtrac", "Massey Ferguson", "Sonalika", "Kubota tractor", "VST Shakti", "Captain tractor", "tractor on rent", "tractor hire", "tractor trolley", "tractor loader", "tractor backhoe", "rotavator", "cultivator", "plough", "laser leveler", "straw reaper", "sprayer", "potato planter", "tractor with trolley", "tractor with loader", "trolley wala tractor", "gaddi", "45 HP tractor", "50 HP tractor", "55 HP tractor", "65 HP tractor", "75 HP tractor", "electric tractor", "tractor attachment"
    ],
    "Combine Harvester": [
        "harvester", "combine", "harvesting machine", "fasal kaatne wali machine", "combine harvester", "crop cutter", "wheat cutter", "paddy harvester", "reaper", "cutting machine", "thresher", "grain harvester", "gehu katne ki machine", "dhaan katne ki machine", "fasal katne ki machine", "combine machine", "tracked harvester", "paddy combine", "wheat combine", "multi crop harvester", "tractor mounted harvester", "mini harvester", "walk behind harvester", "Kartar harvester", "Preet harvester", "Dasmesh harvester", "Malkit harvester", "John Deere harvester", "Claas harvester", "Kubota harvester", "Swaraj harvester", "Yanmar harvester", "harvester on rent", "combine on rent", "katai machine hire"
    ],
    "Drill": [
        "drill", "drilling machine", "bore machine", "hole machine", "auger drill", "blast hole drill", "rock drill", "DTH drill", "rotary drill", "wagon drill", "mining drill", "quarry drill", "borewell machine", "compressor drill", "surface drill", "underground drill", "jumbo drill", "face jumbo", "tunnel drill", "metro drill", "twin boom drill", "pathhar todne ki machine", "boring machine", "khadaan ki machine", "blast machine", "pathar drill", "Epiroc drill", "Sandvik drill", "Revathi drill", "Atlas Copco", "PRD", "KGR", "Furukawa", "Junjin", "FlexiROC", "SmartROC", "AirROC", "PowerROC", "Ranger", "Leopard", "Pantera", "Pit Viper", "tractor mounted drill", "drill on rent", "quarry drill hire", "coal drill", "iron ore drill", "granite drill", "limestone drill", "DTH hammer", "compressor and drill"
    ],
    "Walking Dragline": [
        "dragline", "mining machine", "heavy digging machine", "walking dragline", "crawler dragline", "canal dragline", "stripping machine", "overburden machine", "rope shovel", "electric shovel", "mining shovel", "face shovel", "coal shovel", "P&H shovel", "coal mine machine", "chalne wali badi machine", "sabse badi machine", "bijli wali shovel", "nadi ki machine", "reti nikalne ki machine", "nala safai ki machine", "canal machine", "dredger", "river machine", "sand mining machine", "HEC dragline", "BEML dragline", "Komatsu P&H", "CAT dragline", "Tata P&H", "Link-Belt", "Sany dragline", "Manitowoc", "Liebherr", "Kobelco", "EKG", "cable shovel", "LHD", "load haul dump", "underground loader", "scooptram", "tunnel loader", "Sandvik LHD", "Epiroc LHD", "mine loader"
    ],
    "Crawler Dragline": [
        "crawler dragline", "dragline", "walking dragline", "mining machine", "heavy digging machine", "canal dragline", "stripping machine", "overburden machine", "rope shovel", "electric shovel", "mining shovel", "face shovel", "coal shovel", "P&H shovel", "coal mine machine", "chalne wali badi machine", "sabse badi machine", "bijli wali shovel", "nadi ki machine", "reti nikalne ki machine", "nala safai ki machine", "canal machine", "dredger", "river machine", "sand mining machine", "HEC dragline", "BEML dragline", "Komatsu P&H", "CAT dragline", "Tata P&H", "Link-Belt", "Sany dragline", "Manitowoc", "Liebherr", "Kobelco", "EKG", "cable shovel", "LHD", "load haul dump", "underground loader", "scooptram", "tunnel loader", "Sandvik LHD", "Epiroc LHD", "mine loader"
    ],
    "Mini Trucks / small Trucks": [
        "small truck", "chota hathi", "tata ace", "mini truck", "pickup", "auto loader", "three wheeler cargo", "cargo auto", "ape", "tempo", "chhota tempo", "delivery auto", "loading auto", "mini tempo", "LCV", "delivery truck", "cargo van", "Piaggio Ape", "Mahindra Alfa", "Atul Gem", "Mahindra Jeeto", "Mahindra Supro", "Maruti Super Carry", "Tata Ace Gold", "chhoti gaadi", "delivery gaadi", "courier gaadi", "packet gaadi", "loading gaadi", "sabzi auto", "pani auto", "tinka", "maal dhone wali auto", "FMCG truck", "last mile delivery", "intra city truck", "mini truck on rent", "chhota hathi kiraye par", "tempo kiraye par"
    ],
    "Trucks": [
        "truck", "lorry", "maal gadi", "407", "four o seven", "chhota truck", "4 tyre truck", "light truck", "6 tyre truck", "10 wheeler", "12 wheeler", "16 wheeler", "heavy truck", "HCV", "ICV", "LCV", "multi axle truck", "container truck", "cargo truck", "goods carrier", "highway truck", "long truck", "trailer", "tractor trailer", "prime mover", "flatbed", "das pahiya", "barah pahiya", "solah pahiya", "lambi gaadi", "bhari truck", "parcel truck", "Amazon truck", "Flipkart truck", "Tata truck", "Ashok Leyland", "Eicher truck", "BharatBenz", "Mahindra Blazo", "Volvo truck", "Scania", "SML Isuzu", "Tata 407", "Tata Signa", "Tata Prima", "Eicher Pro", "electric truck", "EV truck", "Tata Ace EV", "char tyre", "cheh tyre", "furniture truck", "shifting truck", "market load", "cement truck", "truck on rent", "truck hire", "transport", "logistics truck"
    ],
    "Tippers": [
        "dumper", "tipper", "dump truck", "construction truck", "mini tipper", "chhota tipper", "heavy tipper", "10 wheeler tipper", "12 wheeler tipper", "mining tipper", "off highway dumper", "OHT", "haul truck", "sand tipper", "aggregate tipper", "coal tipper", "reti ki gaadi", "eent ki gaadi", "mitti ki gaadi", "site ki gaadi", "gitti tipper", "pathhar tipper", "highway tipper", "bada tipper", "das pahiya tipper", "barah pahiya tipper", "Tata tipper", "Ashok Leyland tipper", "BharatBenz tipper", "Mahindra Blazo tipper", "Volvo FMX", "Scania tipper", "BEML dumper", "CAT dumper", "CAT 777", "Komatsu dumper", "Sany dumper", "Tata Signa tipper", "Tata 912", "Tata 1918", "tipper on rent", "dumper on rent", "construction tipper hire", "road work tipper", "earthwork tipper", "100 ton dumper", "mining truck", "quarry dumper"
    ],
    "Reach Stacker": [
        "reach stacker", "container handler", "container lifter", "container crane", "port crane", "ICD crane", "container stacker", "port machine", "container uthane ki machine", "Kalmar", "Sany reach stacker", "Konecranes", "Linde", "ACE reach stacker", "Liebherr", "Hyster", "loaded container handler", "empty container stacker", "45 ton reach stacker", "reach stacker on rent", "port equipment", "ICD equipment"
    ],
    "Tow Truck": [
        "tow truck", "recovery van", "breakdown van", "gadi uthane wali gaadi", "towing vehicle", "wrecker", "flatbed tow", "rollback", "car carrier", "bike carrier", "roadside assistance", "car uthane ki gaadi", "breakdown gaadi", "khinchne wali gaadi", "accident gaadi", "bike rescue gaadi", "puncture gaadi", "wheel lift", "underlift", "towing gaadi", "tow truck on rent", "recovery vehicle", "car towing", "bike towing", "highway recovery", "heavy recovery", "bus recovery", "truck recovery", "motorcycle carrier", "mobile workshop", "breakdown service", "Tata 407 tow", "Mahindra Bolero tow", "flatbed carrier"
    ],
    "Motor Bike & scooter 2 wheeler": [
        "bike", "scooter", "2 wheeler", "delivery bike", "cargo bike", "commercial bike", "EV bike", "electric scooter", "electric bike", "delivery vehicle", "food delivery bike", "courier bike", "Zomato bike", "Swiggy bike", "packet wali bike", "dabbawala bike", "TVS", "Hero", "Bajaj", "Honda", "Ola electric", "Ather", "Hero Electric", "Yulu", "Bounce", "last mile delivery", "2 wheeler on rent", "scooty on rent", "bike rental", "delivery scooty"
    ],
    "Water Tanker": [
        "water tanker", "tanker", "pani ka tanker", "water supply", "water truck", "tanker truck", "construction water", "curing tanker", "pani ki gaadi", "paani supply", "tanker wala", "5000 liter tanker", "10000 liter tanker", "15000 liter tanker", "20000 liter tanker", "water tanker on rent", "tanker hire", "drinking water tanker", "construction site water", "dust suppression tanker", "TPS tanker", "Maniar tanker"
    ],
    "Sewage Truck": [
        "sewage truck", "suction machine", "suction tanker", "sewer cleaner", "jetting machine", "super sucker", "drain cleaner", "septic tank cleaner", "vacuum tanker", "gutter safai", "nali safai machine", "sewer ki gaadi", "ganda pani ki gaadi", "septic tank safai", "naali machine", "tatti machine", "drainage cleaner", "manhole cleaner", "blockage cleaner", "high pressure jetting", "suction cum jetting", "Kam-Avida", "IPWT", "Maniar", "sewage pump", "sewer suction", "suction machine on rent", "jetting machine on rent", "nala safai", "gutter cleaning machine"
    ],
    "Garbage collection": [
        "garbage truck", "dustbin truck", "kachra gaadi", "compactor truck", "hook loader", "sweeper truck", "waste truck", "municipal truck", "dustbin lifter", "refuse truck", "safai gaadi", "dustbin wali gaadi", "jhadu gaadi", "kachre ki gaadi", "nagar palika gaadi", "safai vehicle", "garbage collection", "waste collection", "garbage compactor", "road sweeper", "dumper placer", "twin bin lifter", "hook loader", "vacuum sweeper", "Kam-Avida", "Roots Multiclean", "TPS", "Hyva", "garbage truck on rent", "municipal vehicle", "society garbage", "colony kachra gaadi", "tractor trolley garbage", "garbage"
    ],
    "Truck-Mounted Boom Lift": [
        "sky lift", "truck mounted lift", "bucket truck", "aerial truck", "street light machine", "CCTV machine", "pole machine", "tree trimmer", "municipal lift", "insulated lift", "fire rescue lift", "E-work lift", "pole wali gaadi", "street light ki gaadi", "ped katne ki gaadi", "bijli ki gaadi", "fire brigade lift", "nagar palika lift", "Palfinger lift", "Nandan GSE", "Socage", "Ruthmann", "Bronto Skylift", "Versalift", "Terex", "14m truck lift", "20m truck lift", "30m truck lift", "50m truck lift", "90m truck lift", "sky lift on rent", "truck lift hire", "insulated platform", "electrical maintenance lift", "live line machine"
    ],
    "Towable Boom Lift": [
        "towable lift", "trailer lift", "tow behind lift", "portable boom", "trailer mounted lift", "contractor lift", "khinchne wali lift", "trailer wali lift", "JLG Tow-Pro", "Genie TZ", "Niftylift", "Snorkel", "Dinolift", "towable lift on rent", "portable lift", "DIY lift", "residential painting lift", "small contractor lift"
    ],
    "Rope Shovel": [
        "rope shovel", "electric shovel", "mining shovel", "face shovel", "cable shovel", "coal shovel", "P&H shovel", "bijli wali shovel", "coal mine ki badi machine", "badi khadaan machine", "P&H 1900", "P&H 2300", "P&H 4100", "Komatsu shovel", "CAT 7495", "HEC shovel", "BEML shovel", "IZ-Kartex", "EKG", "10 cubic meter", "20 cubic meter", "42 cubic meter", "coal India machine", "mining production shovel", "electric hydraulic face shovel"
    ],
    "LHD Loader": [
        "LHD", "load haul dump", "underground loader", "mine loader", "scooptram", "tunnel loader", "coal loader underground", "underground machine", "andar ki loader", "khadaan ki loader", "surung ki machine", "Sandvik LH", "Epiroc ST", "CAT R1300", "CAT R1600", "CAT R1700", "CAT R2900", "Komatsu WX", "GHH LF", "BEML BL", "EIMCO", "electric LHD", "battery LHD", "cable reel LHD", "flameproof loader", "underground coal loader"
    ],
    "Tractor Attachment": [
        "tractor trolley", "tractor trailer", "hydraulic trolley", "tipping trolley", "tractor loader", "front loader", "backhoe attachment", "dozer blade", "grader attachment", "road sweeper", "post hole digger", "auger", "tractor crane", "compressor", "rotavator", "cultivator", "plough", "baler", "straw reaper", "mulcher", "laser leveler", "sprayer", "potato planter", "harvester attachment", "trolley", "dala", "trailer", "gadda", "palat ne wala trolley", "peeche wali JCB", "aage ka blade", "tractor pe lagi JCB", "sasti JCB", "khudai attachment", "rotary tiller", "bhusa machine", "dawai spray", "aloo machine", "tractor attachment on rent"
    ],
    "Recovery Van and Tow Truck": [
        "tow truck", "recovery van", "breakdown van", "gadi uthane wali gaadi", "towing vehicle", "wrecker", "flatbed tow", "rollback", "car carrier", "bike carrier", "roadside assistance", "car uthane ki gaadi", "breakdown gaadi", "khinchne wali gaadi", "accident gaadi", "bike rescue gaadi", "puncture gaadi", "wheel lift", "underlift", "towing gaadi", "tow truck on rent", "recovery vehicle", "car towing", "bike towing", "highway recovery", "heavy recovery", "bus recovery", "truck recovery", "motorcycle carrier", "mobile workshop", "breakdown service", "Tata 407 tow", "Mahindra Bolero tow", "flatbed carrier"
    ],
    "Vertical Mast Lift": [
        "vertical mast lift", "mast lift", "vertical lift", "compact vertical lift", "indoor vertical lift", "narrow aisle vertical lift", "warehouse vertical lift", "electric vertical lift", "self propelled vertical lift", "JLG vertical mast", "Genie vertical mast", "Haulotte vertical mast", "Dingli vertical mast", "20m vertical mast", "30m vertical mast", "vertical mast on rent", "vertical mast hire", "vertical mast rental"
    ],
    "Dual Mast Lift (Aluminium)": [
        "dual mast lift", "aluminium mast lift", "dual mast aluminium lift", "compact dual mast lift", "indoor dual mast lift", "narrow aisle dual mast lift", "warehouse dual mast lift", "electric dual mast lift", "self propelled dual mast lift", "JLG dual mast", "Genie dual mast", "Haulotte dual mast", "Dingli dual mast", "20m dual mast", "30m dual mast", "dual mast on rent", "dual mast hire", "dual mast rental"
    ],
    "Dumper": [
        "dumper", "tipper", "dump truck", "construction truck", "mini tipper", "chhota tipper", "heavy tipper", "10 wheeler tipper", "12 wheeler tipper", "mining tipper", "off highway dumper", "OHT", "haul truck", "sand tipper", "aggregate tipper", "coal tipper", "reti ki gaadi", "eent ki gaadi", "mitti ki gaadi", "site ki gaadi", "gitti tipper", "pathhar tipper", "highway tipper", "bada tipper", "das pahiya tipper", "barah pahiya tipper", "Tata tipper", "Ashok Leyland tipper", "BharatBenz tipper", "Mahindra Blazo tipper", "Volvo FMX", "Scania tipper", "BEML dumper", "CAT dumper", "CAT 777", "Komatsu dumper", "Sany dumper", "Tata Signa tipper", "Tata 912", "Tata 1918", "tipper on rent", "dumper on rent", "construction tipper hire", "road work tipper", "earthwork tipper", "100 ton dumper", "mining truck", "quarry dumper"
    ],
};
