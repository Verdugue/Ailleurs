// Photos vérifiées (HEAD 200) par script avant intégration — voir README.
// Sources : Wikimedia Commons (lieux réels) et Unsplash (ambiances).
// Une clé absente => undefined => le dégradé de la carte sert de secours.

export const unsplash = (id: string, w = 900): string =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const wm = 'https://upload.wikimedia.org/wikipedia/commons'

export const IMG: Record<string, string> = {
  // ---- Ambiances (Unsplash, vérifiées) ----
  'amb-restaurant': unsplash('photo-1414235077428-338989a2e8c0'),
  'amb-jazz': unsplash('photo-1415201364774-f6f0bb35f28f'),
  'amb-concert': unsplash('photo-1470229722913-7c0e2dbbafd3'),
  'amb-party': unsplash('photo-1533174072545-7a4b6ad7a6c3'),
  'amb-food': unsplash('photo-1555939594-58d7cb561ad1'),
  'amb-sushi': unsplash('photo-1579871494447-9811cf80d66c'),
  'amb-gallery': unsplash('photo-1518998053901-5348d3961a04'),
  'amb-digital': unsplash('photo-1550684376-efcbd6e3f031'),
  'amb-lanterns': unsplash('photo-1478145046317-39f10e56b5e9'),
  'amb-ramen': unsplash('photo-1569718212165-3a8278d5f624'),
  'amb-pasta': unsplash('photo-1551183053-bf91a1d81141'),
  'amb-paella': unsplash('photo-1512058564366-18510be2db19'),
  'amb-curry': unsplash('photo-1585937421612-70a008356fbe'),
  'amb-tacos': unsplash('photo-1565299585323-38d6b0865b47'),
  'amb-padthai': unsplash('photo-1552465011-b4e21bf6e79a'),
  'amb-beer': unsplash('photo-1608270586620-248524c67de9'),
  'amb-xmas': unsplash('photo-1512389142860-9c449e58a543'),
  'amb-fireworks': unsplash('photo-1467810563316-b5476525c0f9'),

  // ---- Rome ----
  'rome-hero': unsplash('photo-1552832230-c0197dd311b5', 1600),
  'rome-colisee': `${wm}/thumb/d/de/Colosseo_2020.jpg/960px-Colosseo_2020.jpg`,
  'rome-vatican': `${wm}/thumb/5/5f/Galleria_delle_carte_geografiche_%28Vatican_Museums%29_September_2015-5.jpg/960px-Galleria_delle_carte_geografiche_%28Vatican_Museums%29_September_2015-5.jpg`,
  'rome-trastevere': `${wm}/thumb/d/de/Santa_Maria_in_Trastevere_fountain.jpg/960px-Santa_Maria_in_Trastevere_fountain.jpg`,
  'rome-pantheon': `${wm}/thumb/7/7b/Pantheon_%28Rome%29_-_Right_side_and_front.jpg/960px-Pantheon_%28Rome%29_-_Right_side_and_front.jpg`,
  'rome-borghese': `${wm}/thumb/5/5d/Galleria_borghese_facade.jpg/960px-Galleria_borghese_facade.jpg`,
  'rome-maxxi': `https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/MAXXI_%2827483747665%29.jpg/960px-MAXXI_%2827483747665%29.jpg`,
  'rome-caracalla': `${wm}/thumb/5/53/Baths_of_Caracalla%2C_facing_Caldarium.jpg/960px-Baths_of_Caracalla%2C_facing_Caldarium.jpg`,

  // ---- Barcelone ----
  'barcelone-hero': unsplash('photo-1583422409516-2895a77efded', 1600),
  'barcelone-sagrada': `${wm}/thumb/e/ef/SF_maig_2_cropped.jpg/960px-SF_maig_2_cropped.jpg`,
  'barcelone-guell': `${wm}/thumb/3/33/Parc_guell_-_panoramio.jpg/960px-Parc_guell_-_panoramio.jpg`,
  'barcelone-picasso': `${wm}/4/48/Museu_Picasso_Barcelona.jpg`,
  'barcelone-gotic': `${wm}/6/6d/Barcelona_-_Carrer_del_Bisbe.jpg`,
  'barcelone-miro': `${wm}/thumb/9/9e/Joan_Mir%C3%B3_i_l%27Objecte_2016.jpg/960px-Joan_Mir%C3%B3_i_l%27Objecte_2016.jpg`,
  'barcelone-boqueria': `${wm}/thumb/9/96/Barcelona_-_Mercat_de_Sant_Josep_%28la_Boqueria%29_-_Entrance.jpg/960px-Barcelona_-_Mercat_de_Sant_Josep_%28la_Boqueria%29_-_Entrance.jpg`,

  // ---- Lisbonne ----
  'lisbonne-hero': unsplash('photo-1585208798174-6cedd86e019a', 1600),
  'lisbonne-belem': `${wm}/thumb/f/fa/Bel%C3%A9m_Tower_in_Lisbon%2C_Portugal.jpg/960px-Bel%C3%A9m_Tower_in_Lisbon%2C_Portugal.jpg`,
  'lisbonne-maat': `${wm}/thumb/2/21/MAAT.jpg/960px-MAAT.jpg`,
  'lisbonne-alfama': `${wm}/thumb/0/07/Lisbon_alfalma.jpg/960px-Lisbon_alfalma.jpg`,
  'lisbonne-timeout': `${wm}/thumb/c/cd/Drinks_at_Mercado_da_Ribeira_%28Lissabon_2016%29_%2826003375942%29.jpg/960px-Drinks_at_Mercado_da_Ribeira_%28Lissabon_2016%29_%2826003375942%29.jpg`,
  'lisbonne-tram': `${wm}/thumb/1/16/Lisbon-Day3-1_%2834184431096%29.jpg/960px-Lisbon-Day3-1_%2834184431096%29.jpg`,
  'lisbonne-lx': `${wm}/thumb/9/93/LX_Factory_Lisbon_%2844543156954%29.jpg/960px-LX_Factory_Lisbon_%2844543156954%29.jpg`,
  'lisbonne-nata': `${wm}/thumb/0/0c/Pasteis_de_Belem.jpg/960px-Pasteis_de_Belem.jpg`,
  'lisbonne-comercio': `${wm}/thumb/6/63/Lisbon_%2836211708233%29_%28cropped%29.jpg/960px-Lisbon_%2836211708233%29_%28cropped%29.jpg`,

  // ---- Londres ----
  'londres-hero': unsplash('photo-1513635269975-59663e0ac1ad', 1600),
  'londres-british': `${wm}/thumb/8/86/British_Museum_%28aerial%29.jpg/960px-British_Museum_%28aerial%29.jpg`,
  'londres-towerbridge': `${wm}/thumb/5/59/Tower_Bridge_at_Dawn.jpg/960px-Tower_Bridge_at_Dawn.jpg`,
  'londres-camden': `${wm}/thumb/2/2b/Camden_markets_entrance.JPG/960px-Camden_markets_entrance.JPG`,
  'londres-tate': `${wm}/thumb/0/00/Tate_Modern_-_Bankside_Power_Station.jpg/960px-Tate_Modern_-_Bankside_Power_Station.jpg`,
  'londres-notting': `${wm}/0/04/London_110.jpg`,
  'londres-roundhouse': `${wm}/4/4c/The_Roundhouse%2C_Chalk_Farm_Road%2C_London_NW1_-_geograph.org.uk_-_399270.jpg`,
  'londres-borough': `${wm}/thumb/2/2d/London_2018_March_IMG_0663.jpg/960px-London_2018_March_IMG_0663.jpg`,

  // ---- Amsterdam ----
  'amsterdam-hero': unsplash('photo-1534351590666-13e3e96b5017', 1600),
  'amsterdam-rijks': `${wm}/thumb/8/80/South_facade_of_the_Rijksmuseum_Amsterdam_%28DSCF0528%29.jpg/960px-South_facade_of_the_Rijksmuseum_Amsterdam_%28DSCF0528%29.jpg`,
  'amsterdam-canaux': `${wm}/thumb/0/00/Prinsengracht_Amsterdam.jpg/960px-Prinsengracht_Amsterdam.jpg`,
  'amsterdam-jordaan': `${wm}/thumb/6/65/Eerste_Leliedwarsstraat.jpg/960px-Eerste_Leliedwarsstraat.jpg`,
  'amsterdam-vangogh': `${wm}/thumb/b/b2/Van_Gogh_Museum_2537.jpg/960px-Van_Gogh_Museum_2537.jpg`,
  'amsterdam-vondel': `${wm}/thumb/3/3b/Amsterdam%2C_Vondelpark%2C_at_the_pond-2.jpg/960px-Amsterdam%2C_Vondelpark%2C_at_the_pond-2.jpg`,
  'amsterdam-light': `${wm}/thumb/3/38/Amsterdam_%2815437486254%29.jpg/960px-Amsterdam_%2815437486254%29.jpg`,
  'amsterdam-concertgebouw': `${wm}/thumb/e/e5/ConcertgebouwMuseumpleinAmsterdam.jpg/960px-ConcertgebouwMuseumpleinAmsterdam.jpg`,

  // ---- Berlin ----
  'berlin-hero': unsplash('photo-1560969184-10fe8719e047', 1600),
  'berlin-brandebourg': `${wm}/thumb/a/a6/Brandenburger_Tor_abends.jpg/960px-Brandenburger_Tor_abends.jpg`,
  'berlin-eastside': `${wm}/thumb/2/2b/Segment_with_Graffiti_of_the_Berlin_Wall_%283_of_4%29_%28cropped%29.jpg/960px-Segment_with_Graffiti_of_the_Berlin_Wall_%283_of_4%29_%28cropped%29.jpg`,
  'berlin-museumsinsel': `${wm}/thumb/c/c9/Berlin_Museumsinsel_Fernsehturm.jpg/960px-Berlin_Museumsinsel_Fernsehturm.jpg`,
  'berlin-markthalle': `${wm}/thumb/f/f6/Markthalle_Neun_08.02.2015_16-39-58.JPG/960px-Markthalle_Neun_08.02.2015_16-39-58.JPG`,
  'berlin-kreuzberg': `${wm}/thumb/1/10/Tempelhofer_Ufer_B-Kreuzberg_06-2017_img2.jpg/960px-Tempelhofer_Ufer_B-Kreuzberg_06-2017_img2.jpg`,
  'berlin-tiergarten': `${wm}/0/08/Berlin_Tiergarten_Siegess%C3%A4ule_Luftansicht.jpg`,

  // ---- Prague ----
  'prague-hero': unsplash('photo-1519677100203-a0e668c92439', 1600),
  'prague-charles': `${wm}/thumb/2/22/Prague_07-2016_view_from_Lesser_Town_Tower_of_Charles_Bridge_img3.jpg/960px-Prague_07-2016_view_from_Lesser_Town_Tower_of_Charles_Bridge_img3.jpg`,
  'prague-chateau': `${wm}/thumb/9/92/Panorama_of_Vltava_river_and_Prague_Castle.jpg/960px-Panorama_of_Vltava_river_and_Prague_Castle.jpg`,
  'prague-dox': `${wm}/thumb/f/f4/110217_DOX_Prague_-9.JPG/960px-110217_DOX_Prague_-9.JPG`,
  'prague-oldtown': `${wm}/thumb/4/44/Prague_07-2016_View_from_Old_Town_Hall_Tower_img3.jpg/960px-Prague_07-2016_View_from_Old_Town_Hall_Tower_img3.jpg`,
  'prague-galerie': `${wm}/thumb/a/a5/Praha_Veletr%C5%BEn%C3%AD_pal%C3%A1c_jih.jpg/960px-Praha_Veletr%C5%BEn%C3%AD_pal%C3%A1c_jih.jpg`,
  'prague-rudolfinum': `${wm}/thumb/8/8d/Praha_Rudolfinum_front.jpg/960px-Praha_Rudolfinum_front.jpg`,
  'prague-signal': `${wm}/thumb/4/42/Church_of_St._Ludmila%2C_Signal_festival_2017.jpg/960px-Church_of_St._Ludmila%2C_Signal_festival_2017.jpg`,

  // ---- Istanbul ----
  'istanbul-hero': unsplash('photo-1524231757912-21f4fe3a7200', 1600),
  'istanbul-hagia': `${wm}/thumb/4/4a/Hagia_Sophia_%28228968325%29.jpeg/960px-Hagia_Sophia_%28228968325%29.jpeg`,
  'istanbul-bazar': `${wm}/thumb/d/de/Istanbul_asv2021-11_img41_Grand_Bazaar.jpg/960px-Istanbul_asv2021-11_img41_Grand_Bazaar.jpg`,
  'istanbul-bleue': `${wm}/thumb/0/03/Istanbul_%2834223582516%29_%28cropped%29.jpg/960px-Istanbul_%2834223582516%29_%28cropped%29.jpg`,
  'istanbul-modern': `${wm}/thumb/f/f9/Istanbul%2C_Turkey_%28November_2023%29_-_611.jpg/960px-Istanbul%2C_Turkey_%28November_2023%29_-_611.jpg`,
  'istanbul-pera': unsplash('photo-1518998053901-5348d3961a04'),
  'istanbul-ortakoy': `${wm}/thumb/d/d8/Istanbul_asv2020-02_img60_Ortak%C3%B6y_Mosque.jpg/960px-Istanbul_asv2020-02_img60_Ortak%C3%B6y_Mosque.jpg`,

  // ---- New York ----
  'newyork-hero': unsplash('photo-1496442226666-8d4d0e62e6e9', 1600),
  'newyork-central': `${wm}/thumb/f/f1/Global_Citizen_Festival_Central_Park_New_York_City_from_NYonAir_%2815351915006%29.jpg/960px-Global_Citizen_Festival_Central_Park_New_York_City_from_NYonAir_%2815351915006%29.jpg`,
  'newyork-moma': `${wm}/thumb/8/8b/MoMa_NY_USA_1.jpg/960px-MoMa_NY_USA_1.jpg`,
  'newyork-brooklyn': `${wm}/thumb/f/f0/Brooklyn_Bridge_and_the_Lower_Manhattan_skyline_from_Pebble_Beach%2C_New_York.jpg/960px-Brooklyn_Bridge_and_the_Lower_Manhattan_skyline_from_Pebble_Beach%2C_New_York.jpg`,
  'newyork-katz': `${wm}/thumb/b/b2/Katz%27s_Delicatessen_%2851623899326%29.jpg/960px-Katz%27s_Delicatessen_%2851623899326%29.jpg`,
  'newyork-highline': `${wm}/thumb/5/5a/High_Line_Park%2C_Section_1a.jpg/960px-High_Line_Park%2C_Section_1a.jpg`,
  'newyork-whitney': `${wm}/thumb/5/59/Whitney_Museum_of_American_Art_%2849051573133%29.jpg/960px-Whitney_Museum_of_American_Art_%2849051573133%29.jpg`,
  'newyork-lincoln': `${wm}/thumb/2/24/Lincoln_Center_Overview_%2848047495362%29.jpg/960px-Lincoln_Center_Overview_%2848047495362%29.jpg`,

  // ---- Montréal ----
  'montreal-hero': `${wm}/thumb/4/47/Montreal_Twilight_Panorama_2006.jpg/960px-Montreal_Twilight_Panorama_2006.jpg`,
  'montreal-vieux': `${wm}/e/e6/Old_Port_of_Montreal_%28French-_Vieux-Port_de_Montr%C3%A9al%29.jpg`,
  'montreal-mont': `${wm}/thumb/7/74/Le_Plateau-Mont-Royal_-_Mont-Royal.jpg/960px-Le_Plateau-Mont-Royal_-_Mont-Royal.jpg`,
  'montreal-mbam': `${wm}/thumb/e/ee/Museum_of_Fine_Arts%2C_main_entrance%2C_Montreal.jpg/960px-Museum_of_Fine_Arts%2C_main_entrance%2C_Montreal.jpg`,
  'montreal-jeantalon': `${wm}/thumb/5/53/March%C3%A9_Jean-Talon_05-11-2024.jpg/960px-March%C3%A9_Jean-Talon_05-11-2024.jpg`,
  'montreal-plateau': `${wm}/thumb/0/07/Plateau_Mont-Royal.jpg/960px-Plateau_Mont-Royal.jpg`,
  'montreal-placedesarts': `${wm}/thumb/b/be/PlacedesArts_Credit_Caroline_Bergeron.jpg/960px-PlacedesArts_Credit_Caroline_Bergeron.jpg`,

  // ---- Rio de Janeiro ----
  'rio-hero': unsplash('photo-1483729558449-99ef09a8c325', 1600),
  'rio-christ': `${wm}/thumb/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg/960px-Christ_the_Redeemer_-_Cristo_Redentor.jpg`,
  'rio-sugarloaf': `${wm}/thumb/8/8d/P%C3%A3o_de_A%C3%A7ucar_-_Sugarloaf_Mountain_-_Zuckerhut_-_2022.jpg/960px-P%C3%A3o_de_A%C3%A7ucar_-_Sugarloaf_Mountain_-_Zuckerhut_-_2022.jpg`,
  'rio-selaron': `${wm}/thumb/2/21/JorgeSelaron2010_1.jpg/960px-JorgeSelaron2010_1.jpg`,
  'rio-colombo': `${wm}/thumb/9/92/Rio_de_janeiro%2C_confeiteria_colombo%2C_int._01.JPG/960px-Rio_de_janeiro%2C_confeiteria_colombo%2C_int._01.JPG`,
  'rio-copacabana': `${wm}/thumb/6/62/Praia_de_Copacabana_-_Rio_de_Janeiro%2C_Brasil.jpg/960px-Praia_de_Copacabana_-_Rio_de_Janeiro%2C_Brasil.jpg`,
  'rio-tomorrow': `${wm}/thumb/6/63/Museu_do_Amanh%C3%A3_rio.jpg/960px-Museu_do_Amanh%C3%A3_rio.jpg`,
  'rio-lapa': `${wm}/thumb/9/9c/Centro_do_Rio_de_Janeiro_by_Diego_Baravelli.jpg/960px-Centro_do_Rio_de_Janeiro_by_Diego_Baravelli.jpg`,

  // ---- Mexico ----
  'mexico-hero': unsplash('photo-1518105779142-d975f22f1b0a', 1600),
  'mexico-zocalo': `${wm}/thumb/5/5d/Z%C3%B3calo%2C_Ciudad_de_M%C3%A9xico_%2832846556446%29_%28cropped%29.jpg/960px-Z%C3%B3calo%2C_Ciudad_de_M%C3%A9xico_%2832846556446%29_%28cropped%29.jpg`,
  'mexico-frida': `${wm}/thumb/4/4c/Museo_Frida_Kahlo.JPG/960px-Museo_Frida_Kahlo.JPG`,
  'mexico-teotihuacan': `${wm}/thumb/5/58/Teotihuac%C3%A1n-5973.JPG/960px-Teotihuac%C3%A1n-5973.JPG`,
  'mexico-coyoacan': `${wm}/thumb/5/57/Puerta_a_Coyoac%C3%A1n.JPG/960px-Puerta_a_Coyoac%C3%A1n.JPG`,
  'mexico-anthro': `${wm}/9/94/Musee_National_Anthropologie-Entree.jpg`,
  'mexico-muertos': `${wm}/thumb/6/68/Catrina_3.jpg/960px-Catrina_3.jpg`,
  'mexico-bellasartes': `${wm}/thumb/9/97/Bellas_Artes_01.jpg/960px-Bellas_Artes_01.jpg`,

  // ---- Marrakech ----
  'marrakech-hero': unsplash('photo-1597212618440-806262de4f6b', 1600),
  'marrakech-jemaa': `${wm}/thumb/7/79/Djemaa_el_Fna.jpg/960px-Djemaa_el_Fna.jpg`,
  'marrakech-majorelle': `${wm}/thumb/c/c2/Le_jardin_des_majorelle_40.JPG/960px-Le_jardin_des_majorelle_40.JPG`,
  'marrakech-ysl': `${wm}/thumb/f/fa/YSL_01_Eingangsportal.jpg/960px-YSL_01_Eingangsportal.jpg`,
  'marrakech-medina': `${wm}/thumb/6/67/Medina_souk%2C_Marrakech%2C_Morocco_-_panoramio_%281%29.jpg/960px-Medina_souk%2C_Marrakech%2C_Morocco_-_panoramio_%281%29.jpg`,
  'marrakech-bahia': `${wm}/thumb/f/fc/Bahia_Palace_large_court.jpg/960px-Bahia_Palace_large_court.jpg`,
  'marrakech-badi': `${wm}/thumb/2/2c/%CE%9A%CE%B5%CE%BD%CF%84%CF%81%CE%B9%CE%BA%CE%AE_%CE%B1%CF%85%CE%BB%CE%AE_%CE%95%CE%BB_%CE%9C%CF%80%CE%B1%CE%BD%CF%84%CE%AF_1127.jpg/960px-%CE%9A%CE%B5%CE%BD%CF%84%CF%81%CE%B9%CE%BA%CE%AE_%CE%B1%CF%85%CE%BB%CE%AE_%CE%95%CE%BB_%CE%9C%CF%80%CE%B1%CE%BD%CF%84%CE%AF_1127.jpg`,

  // ---- Le Cap ----
  'lecap-hero': unsplash('photo-1580060839134-75a5edca2e99', 1600),
  'lecap-table': `${wm}/thumb/d/dc/Table_Mountain_DanieVDM.jpg/960px-Table_Mountain_DanieVDM.jpg`,
  'lecap-waterfront': `${wm}/thumb/4/41/Signal_Hill_and_Ferris_wheel_from_Victoria_Wharf_balcony%2C_Cape_Town.jpg/960px-Signal_Hill_and_Ferris_wheel_from_Victoria_Wharf_balcony%2C_Cape_Town.jpg`,
  'lecap-zeitz': `${wm}/thumb/3/3e/Zeitz_Museum_of_Contemporary_Art_Africa%2C_Cape_Town_%28_1050775%29.jpg/960px-Zeitz_Museum_of_Contemporary_Art_Africa%2C_Cape_Town_%28_1050775%29.jpg`,
  'lecap-bokaap': `${wm}/thumb/b/b2/Cape_Town_%28ZA%29%2C_Wale_Street_--_2024_--_3544.jpg/960px-Cape_Town_%28ZA%29%2C_Wale_Street_--_2024_--_3544.jpg`,
  'lecap-kirstenbosch': `${wm}/thumb/5/53/Kirstenbosch_National_Botanical_Garden_2024_7th_batch_09.jpg/960px-Kirstenbosch_National_Botanical_Garden_2024_7th_batch_09.jpg`,

  // ---- Bangkok ----
  'bangkok-hero': unsplash('photo-1508009603885-50cf7c579365', 1600),
  'bangkok-palais': `${wm}/thumb/c/c7/0005574_-_Wat_Phra_Kaew_006.jpg/960px-0005574_-_Wat_Phra_Kaew_006.jpg`,
  'bangkok-watarun': `${wm}/thumb/2/2a/%E0%B9%80%E0%B8%88%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B8%B8%E0%B8%932.jpg/960px-%E0%B9%80%E0%B8%88%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B8%B8%E0%B8%932.jpg`,
  'bangkok-chatuchak': `${wm}/thumb/3/33/Bangkok_-_Jatujak_Market_02.JPG/960px-Bangkok_-_Jatujak_Market_02.JPG`,
  'bangkok-jimthompson': `${wm}/thumb/c/c0/Main_House_of_Jim_Thompson_photo_Don_Ramey_Logan.jpg/960px-Main_House_of_Jim_Thompson_photo_Don_Ramey_Logan.jpg`,
  'bangkok-bacc': `${wm}/thumb/b/b2/BKK_Art_and_Culture_Centre_%28II%29.jpg/960px-BKK_Art_and_Culture_Centre_%28II%29.jpg`,
  'bangkok-loy': `${wm}/thumb/b/bd/Thai_people_setting_their_candle-lit_krathongs_in_the_Ping_river_at_night_during_Loy_Krathong_2015-10_%2822715933524%29.jpg/960px-Thai_people_setting_their_candle-lit_krathongs_in_the_Ping_river_at_night_during_Loy_Krathong_2015-10_%2822715933524%29.jpg`,
  'bangkok-yaowarat': `${wm}/thumb/9/9e/%282022%29_%E0%B8%95%E0%B8%B6%E0%B8%81%E0%B9%81%E0%B8%96%E0%B8%A7%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%96%E0%B8%99%E0%B8%99%E0%B9%80%E0%B8%A2%E0%B8%B2%E0%B8%A7%E0%B8%A3%E0%B8%B2%E0%B8%8A_%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%AA%E0%B8%B1%E0%B8%A1%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B8%A7%E0%B8%87%E0%B8%A8%E0%B9%8C_%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3_%284%29.jpg/960px-%282022%29_%E0%B8%95%E0%B8%B6%E0%B8%81%E0%B9%81%E0%B8%96%E0%B8%A7%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%96%E0%B8%99%E0%B8%99%E0%B9%80%E0%B8%A2%E0%B8%B2%E0%B8%A7%E0%B8%A3%E0%B8%B2%E0%B8%8A_%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%AA%E0%B8%B1%E0%B8%A1%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B8%A7%E0%B8%87%E0%B8%A8%E0%B9%8C_%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3_%284%29.jpg`,

  // ---- Kyoto ----
  'kyoto-hero': unsplash('photo-1493976040374-85c8e12f0c0e', 1600),
  'kyoto-fushimi': `${wm}/thumb/0/0e/Torii_path_with_lantern_at_Fushimi_Inari_Taisha_Shrine%2C_Kyoto%2C_Japan.jpg/960px-Torii_path_with_lantern_at_Fushimi_Inari_Taisha_Shrine%2C_Kyoto%2C_Japan.jpg`,
  'kyoto-kinkaku': `${wm}/thumb/0/0f/Golden_Pavilion_Kinkaku-ji_water_mirror_2024.jpg/960px-Golden_Pavilion_Kinkaku-ji_water_mirror_2024.jpg`,
  'kyoto-arashiyama': `${wm}/d/de/Arashiyama_013.jpg`,
  'kyoto-nishiki': `${wm}/thumb/c/ce/Nishiki_Ichiba_by_matsuyuki.jpg/960px-Nishiki_Ichiba_by_matsuyuki.jpg`,
  'kyoto-gion': `${wm}/thumb/2/23/150124_Gion_Kyoto_Japan01s3.jpg/960px-150124_Gion_Kyoto_Japan01s3.jpg`,
  'kyoto-manga': `${wm}/thumb/7/75/%E4%BA%AC%E9%83%BD%E5%9B%BD%E9%9A%9B%E3%83%9E%E3%83%B3%E3%82%AC%E3%83%9F%E3%83%A5%E3%83%BC%E3%82%B8%E3%82%A2%E3%83%A0.jpg/960px-%E4%BA%AC%E9%83%BD%E5%9B%BD%E9%9A%9B%E3%83%9E%E3%83%B3%E3%82%AC%E3%83%9F%E3%83%A5%E3%83%BC%E3%82%B8%E3%82%A2%E3%83%A0.jpg`,
  'kyoto-pontocho': `${wm}/thumb/6/68/Pontocho_by_Wolfiewolf_in_Nabeyacho%2C_Kyoto.jpg/960px-Pontocho_by_Wolfiewolf_in_Nabeyacho%2C_Kyoto.jpg`,
}
