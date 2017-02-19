var map_manager = {
    "map" : null,
    "map_items" : []
}

map_manager.map_items = [
    {
      "pokemon_id" : 12,
      "expire" : 1476589403,
      "longitude" : 126.4400345,
      "latitude" : 43.8396651,
    }
]
function query_pokemon_data() {
    var bounds=map_manager.map.getBounds();
    var apigClient = apigClientFactory.newClient();
    var params = {
        //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
        north: 'bounds.getNorth()',
        south: 'bounds.getSouth()',
        west:'bounds.getwest()',
        east:'bounds.getEast()'
    };

    apigClient.mapPokemonGet(params, {}, {})
        .then(function(result){
          map_manager.map_items = result.data; 
            //This is where you would put a success callback
        }).catch( function(result){
            console.log(result);
            //This is where you would put an error callback
        });
}

function loadMapScenario() {
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        credentials: 'AmGfXoPF5L4OcyP3y1T7R9POld5vCh6OkxuB9eRsNaqVvd6J6Z3hHZUWyh79THjC'
    }); 
    map_manager.map=map;
    window.setInterval(refresh_pokemon_layer, 1000);
}
// 1. Define pokemon data format, create mock pokemon data
function get_counter_down_time_from_expire_epoch(epoch) {
  var now_time = new Date().getTime() / 1000;
  var time_left = epoch / 1000 - now_time;   // unit: second
  var second = Math.floor(time_left % 60);
  var minute = Math.floor(time_left / 60);
  return minute + ":" + second;
}

// 2. Create pokemon image on map

// 3. Add pokemon counter down refresh.
function refresh_pokemon_layer() {
  // 1、Prepare new layer
    var layer = new Microsoft.Maps.Layer();
    var pushpins = [];
    for (var i in map_manager.map_items) {
        var map_item = map_manager.map_items[i];
        var icon_url = 'https://raw.githubusercontent.com/longshootzb/firstproject/master/pokemon/' + map_item["pokemon_id"] + '.png';
        var count_down = get_counter_down_time_from_expire_epoch(map_item["expire"]);
        var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(map_item["latitude"], map_item["longitude"]), 
                                                 {title: count_down,
                                                  icon: icon_url});
        pushpins.push(pushpin);
    }
    layer.add(pushpins);
  // 2、Remove old layer
  map_manager.map.layers.clear();
  // 3、Add new layer
  map_manager.map.layers.insert(layer);
}
