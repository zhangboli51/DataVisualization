var Data = (function() {

	var find_scale = function(data, allowed_heroes, indices, data_function) {
		var min_max_set = false;
		var min = 0;
		var max = 0;
		for (var i = 0; i < data.length; i++) {
			var found_id = 0;
			for (var key in indices) {
				if (indices[key] == i)
					found_id = key;
			}
			if (allowed_heroes[found_id]) {
				min = min_max_set ? Math.min(min, data_function(data[i])) : data_function(data[i]);
				max = min_max_set ? Math.max(max, data_function(data[i])) : data_function(data[i]);
				min_max_set = true;
			}
		}	
		var padding = (max - min) * .1;
		return [min - padding, max + padding];
	}

	var find_scale_across_time = function(data_obj, time_window, allowed_heroes, data_function) {
		var data = data_obj.data;
		var min = data_function(data[0].data[0]);
		var max = data_function(data[0].data[0]);
		var count = data[0].data.length;
		for (var i = 0; i < count; i++) {
			var k = 0;
			var aggregate = new Object();
			var found_id;
			for (var key in data_obj.indices) {
				if (data_obj.indices[key] == i)
					found_id = key;
			}
			if (!allowed_heroes[found_id])
				continue;

			aggregate.id = found_id;
			aggregate.total_kills = 0;
			aggregate.total_deaths = 0;
			aggregate.total_assists = 0;
			aggregate.total_kd = 0;
			aggregate.total_kda = 0;
			aggregate.total_ad = 0;
			aggregate.total_last_hits = 0;
			aggregate.total_denies = 0;
			aggregate.total_gpm = 0;
			aggregate.total_xpm = 0;
			aggregate.total_hero_damage = 0; 
			aggregate.total_tower_damage = 0;
			aggregate.total_hero_healing = 0;

			aggregate.win_count = 0;
			aggregate.data_count = 0;
			aggregate.total_duration = 0;
			for (var j = 0; j < data.length; j++) {
				if (i in data[j].data) {
					for (var key in aggregate) {
						aggregate[key] += data[j].data[i][key];
					}
				} 
				k++;
				if (k > time_window) {
					if (i in data[j - time_window].data) {
						for (var key in aggregate) {
							aggregate[key] -= data[j - time_window].data[i][key];
						}
					}
					k--;
				}
				if (k == time_window) {
					min = Math.min(min, data_function(aggregate));
					max = Math.max(max, data_function(aggregate));
				}
			}
		}	
		var padding = (max - min) * .1;
		return [min - padding, max + padding];
	}

	var find_scale_across_time_windows = function(data_obj, allowed_heroes, data_function) {
		var data = data_obj.data;
		var min = data_function(data[0].data[0]);
		var max = data_function(data[0].data[0]);
		var count = data[0].data.length;
		for (var i = 0; i < count; i++) {
			var aggregate = new Object();
			var found_id;
			for (var key in data_obj.indices) {
				if (data_obj.indices[key] == i)
					found_id = key;
			}
			if (!allowed_heroes[found_id])
				continue;

			aggregate.id = found_id;
			aggregate.total_kills = 0;
			aggregate.total_deaths = 0;
			aggregate.total_assists = 0;
			aggregate.total_kd = 0;
			aggregate.total_kda = 0;
			aggregate.total_ad = 0;
			aggregate.total_last_hits = 0;
			aggregate.total_denies = 0;
			aggregate.total_gpm = 0;
			aggregate.total_xpm = 0;
			aggregate.total_hero_damage = 0; 
			aggregate.total_tower_damage = 0;
			aggregate.total_hero_healing = 0;

			aggregate.win_count = 0;
			aggregate.data_count = 0;
			aggregate.total_duration = 0;
			for (var j = 0; j < data.length; j++) {
				if (i in data[j].data) {
					for (var key in aggregate) {
						aggregate[key] += data[j].data[i][key];
					}
					min = Math.min(min, data_function(aggregate));
					max = Math.max(max, data_function(aggregate));
				} 
				
			}
		}	
		var padding = (max - min) * .1;
		return [min - padding, max + padding];
	}

	var hero_overview_with_time = function(data) {
		var retval = new Object();
		retval.indices = new Object();
		retval.data = [];
		retval.total_data_count = 0;
		var hero_count = 0;

		for (var i = 0; i < data.length; i++) {
			var players = data[i].players;
			var duration = data[i].duration;
			var duration_index = Math.floor((duration - 600) / 60);
			if (retval.data.length <= duration_index) {
				for (var j = retval.data.length; j <= duration_index; j++) {
					retval.data.push({
						data_count: 0,
						data: []
					});
				}
			}
			var time_data = retval.data[duration_index];
			for (var j = 0; j < players.length; j++) {
				var hero_id = players[j].hero_id;
				if (!(hero_id in retval.indices)) {
					retval.indices[hero_id] = hero_count++;
				}
				if (time_data.data.length <= retval.indices[hero_id]) {
					for (var k = time_data.data.length; k <= retval.indices[hero_id]; k++) {
						var temp_hero = new Object();
						var found_id;
						for (var key in retval.indices) {
							if (retval.indices[key] == k)
								found_id = key;
						}
						temp_hero.id = found_id;
						temp_hero.total_kills = 0;
						temp_hero.total_deaths = 0;
						temp_hero.total_assists = 0;
						temp_hero.total_kd = 0;
						temp_hero.total_kda = 0;
						temp_hero.total_ad = 0;
						temp_hero.total_last_hits = 0;
						temp_hero.total_denies = 0;
						temp_hero.total_gpm = 0;
						temp_hero.total_xpm = 0;
						temp_hero.total_hero_damage = 0; 
						temp_hero.total_tower_damage = 0;
						temp_hero.total_hero_healing = 0;

						temp_hero.win_count = 0;
						temp_hero.data_count = 0;
						temp_hero.total_duration = 0;
						time_data.data.push(temp_hero);
					}
				}
				var hero = time_data.data[retval.indices[hero_id]];
				hero.total_kills += players[j].kills;
				hero.total_deaths += players[j].deaths;
				hero.total_kd += players[j].deaths == 0 ? players[j].kills : players[j].kills / players[j].deaths;
				hero.total_kda += players[j].deaths == 0 ? players[j].kills + players[j].assists : (players[j].kills + players[j].assists) / players[j].deaths;
				hero.total_ad += players[j].deaths == 0 ? players[j].assists : players[j].assists / players[j].deaths;
				hero.total_assists += players[j].assists;
				hero.total_last_hits += players[j].last_hits;
				hero.total_denies += players[j].denies;
				hero.total_gpm += players[j].gold_per_min;
				hero.total_xpm += players[j].xp_per_min;
				hero.total_hero_damage += players[j].hero_damage; 
				hero.total_tower_damage += players[j].tower_damage;
				hero.total_hero_healing += players[j].hero_healing;

				var player_slot = players[j].player_slot;
				if (player_slot < 128 && data[i].radiant_win)
					hero.win_count++;
				else if (player_slot >= 128 && !data[i].radiant_win)
					hero.win_count++;
				hero.data_count++;
				hero.total_duration += duration;
			}
			time_data.data_count++;
			retval.total_data_count++;
		}
		return retval;
	}

	var hero_best_win_with = function(data, allowed_heroes, hero_id) {
		var retval = [];
		var heroes = new Object();
		for (var i = 0; i < data.length; i++) {
			var players = data[i].players;
			var team1 = [];
			var team2 = [];
			var found_on_team = 0;
			for (var j = 0; j < players.length; j++) {
				var player = players[j];
				if (player.hero_id == hero_id) {
					if (player.player_slot < 128)
						found_on_team = 1;
					else
						found_on_team = 2;
				} else if (player.player_slot < 128) {
					team1.push(player.hero_id);
				} else
					team2.push(player.hero_id);
			}
			if (found_on_team == 1) {
				for (var k = 0; k < team1.length; k++) {
					if (allowed_heroes[team1[k]]) {
						if (!(team1[k] in heroes)) {
							heroes[team1[k]] = [0, 0];
						}
						if (data[i].radiant_win) {
							heroes[team1[k]][0]++;
						}
						heroes[team1[k]][1]++;
					}
				}
			} else if (found_on_team == 2) {
				for (var k = 0; k < team2.length; k++) {
					if (allowed_heroes[team2[k]]) {
						if (!(team2[k] in heroes)) {
							heroes[team2[k]] = [0, 0];
						}
						if (!data[i].radiant_win) {
							heroes[team2[k]][0]++;
						}
						heroes[team2[k]][1]++;
					}
				}
			}
		}
		while (Object.keys(heroes).length > 0) {
			var max = -1;
			var max_key = null;
			for (var key in heroes) {
				if (max_key == null) {
					max = heroes[key][0] / heroes[key][1];
					max_key = key;
				} else {
					if (heroes[key][0] / heroes[key][1] > max) {
						max = heroes[key][0] / heroes[key][1];
						max_key = key;
					}
				}
			}
			retval.push({id: max_key, win_percent: max});
			delete heroes[max_key];
		}
		return retval;
	}

	var hero_best_win_against = function(data, allowed_heroes, hero_id) {
		var retval = [];
		var heroes = new Object();
		for (var i = 0; i < data.length; i++) {
			var players = data[i].players;
			var team1 = [];
			var team2 = [];
			var found_on_team = 0;
			for (var j = 0; j < players.length; j++) {
				var player = players[j];
				if (player.hero_id == hero_id) {
					if (player.player_slot < 128)
						found_on_team = 1;
					else
						found_on_team = 2;
				} else if (player.player_slot < 128) {
					team1.push(player.hero_id);
				} else
					team2.push(player.hero_id);
			}
			if (found_on_team == 1) {
				for (var k = 0; k < team2.length; k++) {
					if (allowed_heroes[team2[k]]) {
						if (!(team2[k] in heroes)) {
							heroes[team2[k]] = [0, 0];
						}
						if (data[i].radiant_win) {
							heroes[team2[k]][0]++;
						}
						heroes[team2[k]][1]++;
					}
				}
			} else if (found_on_team == 2) {
				for (var k = 0; k < team1.length; k++) {
					if (allowed_heroes[team1[k]]) {
						if (!(team1[k] in heroes)) {
							heroes[team1[k]] = [0, 0];
						}
						if (!data[i].radiant_win) {
							heroes[team1[k]][0]++;
						}
						heroes[team1[k]][1]++;
					}
				}
			}
		}
		while (Object.keys(heroes).length > 0) {
			var max = -1;
			var max_key = null;
			for (var key in heroes) {
				if (max_key == null) {
					max = heroes[key][0] / heroes[key][1];
					max_key = key;
				} else {
					if (heroes[key][0] / heroes[key][1] > max) {
						max = heroes[key][0] / heroes[key][1];
						max_key = key;
					}
				}
			}
			retval.push({id: max_key, win_percent: max});
			delete heroes[max_key];
		}
		return retval;
	}

	var hero_overview = function(data) {
		var retval = new Object();
		retval.indices = new Object();
		retval.data = [];
		retval.total_data_count = 0;

		for (var i = 0; i < data.length; i++) {
			var players = data[i].players;
			var duration = data[i].duration;
			for (var j = 0; j < players.length; j++) {
				var hero_id = players[j].hero_id;
				if (!(hero_id in retval.indices)) {
					var temp_hero = new Object();
					temp_hero.id = hero_id;
					temp_hero.total_kills = 0;
					temp_hero.total_deaths = 0;
					temp_hero.total_assists = 0;
					temp_hero.total_kd = 0;
					temp_hero.total_kda = 0;
					temp_hero.total_ad = 0;
					temp_hero.total_last_hits = 0;
					temp_hero.total_denies = 0;
					temp_hero.total_gpm = 0;
					temp_hero.total_xpm = 0;
					temp_hero.total_hero_damage = 0; 
					temp_hero.total_tower_damage = 0;
					temp_hero.total_hero_healing = 0;

					temp_hero.win_count = 0;
					temp_hero.data_count = 0;
					temp_hero.total_duration = 0;
					retval.indices[hero_id] = retval.data.length;
					retval.data.push(temp_hero);
				}
				var hero = retval.data[retval.indices[hero_id]];
				hero.total_kills += players[j].kills;
				hero.total_deaths += players[j].deaths;
				hero.total_kd += players[j].deaths == 0 ? players[j].kills : players[j].kills / players[j].deaths;
				hero.total_kda += players[j].deaths == 0 ? players[j].kills + players[j].assists : (players[j].kills + players[j].assists) / players[j].deaths;
				hero.total_ad += players[j].deaths == 0 ? players[j].assists : players[j].assists / players[j].deaths;
				hero.total_assists += players[j].assists;
				hero.total_last_hits += players[j].last_hits;
				hero.total_denies += players[j].denies;
				hero.total_gpm += players[j].gold_per_min;
				hero.total_xpm += players[j].xp_per_min;
				hero.total_hero_damage += players[j].hero_damage; 
				hero.total_tower_damage += players[j].tower_damage;
				hero.total_hero_healing += players[j].hero_healing;

				var player_slot = players[j].player_slot;
				if (player_slot < 128 && data[i].radiant_win)
					hero.win_count++;
				else if (player_slot >= 128 && !data[i].radiant_win)
					hero.win_count++;
				hero.data_count++;
				hero.total_duration += duration;
			}
			retval.total_data_count++;
		}
		return retval;
	}

	return {
		find_scale : find_scale,
		find_scale_across_time : find_scale_across_time,
		find_scale_across_time_windows : find_scale_across_time_windows,
		hero_best_win_with : hero_best_win_with,
		hero_best_win_against : hero_best_win_against,
		hero_overview_with_time : hero_overview_with_time,
		hero_overview : hero_overview
	};

})();