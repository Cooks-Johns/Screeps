var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {


// 	TOWER
    var tower = Game.getObjectById('4f171b5f9ca4e3c11dd9f02b');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
	
// CLEAR MEMORY OF OLD CREEP NAMES

  for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
	
// RESPWAN - builders
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builder: ' + builders.length);

    if(builders.length < 5) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], newName,
            {memory: {role: 'builder'}});
    }
// RESPWAN - harvesters
	var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
		console.log('Harvester: ' + harvesters.length);

		if(harvesters.length < 3) {
			var newName = 'Harvester' + Game.time;
			console.log('Spawning new harvester: ' + newName);
			Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], newName,
				{memory: {role: 'harvester'}});
		}
// RESPWAN - upgraders
	var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
		console.log('Upgrader: ' + upgraders.length);

		if(upgraders.length < 1) {
			var newName = 'Upgrader' + Game.time;
			console.log('Spawning new upgrader: ' + newName);
			Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], newName,
				{memory: {role: 'upgrader'}});
		}


// CREEP SPAWNING LOCATION 
    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

// CREEP ROLES
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}