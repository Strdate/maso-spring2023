import { ResultsCollection, TeamResults } from "/imports/api/collections/results";
import { Team, TeamsCollection } from "/imports/api/collections/teams";
import { entityTypes, items } from "/imports/data/map";

export default function cacheResults(gameId: string) {
    ResultsCollection.update({ gameId }, {
        $set: {
            teams: computeResults( TeamsCollection.find({ gameId }).fetch() ),
        }
    })
}

function computeResults(teams: Team[]): TeamResults[] {
    console.log(`Caching results. Teams: ${teams.length}`)
    // Sort teams by score.
    return teams.sort((team1, team2) => {
      let result = compareTotalScores(team1, team2);
      if (result !== 0) {
        return result;
      }
      result = compareTaskCount(team1, team2);
      if (result !== 0) {
        return result;
      }
      const team1Tasks = getSortedTasksByTeamId(team1);
      const team2Tasks = getSortedTasksByTeamId(team2);
      result = compareHighestTask(team1Tasks, team2Tasks);
      if (result !== 0) {
        return result;
      }
      return coinToss(team1);
    }).map((team, index) => { return {
      rank: index +1,
      name: team.name,
      number: team.number,
      isBot: team.isBot,
      money: team.money,
      boostCount: team.boostCount,
      score: team.score,
      ghostCollisions: team.ghostCollisions,
      solvedTaskCount: team.solvedTasks.length,
      changedTaskCount: team.changedTasks.length,
      pickedUpItems: countPickedUpItems(team)
    }})
  }

  function countPickedUpItems(team: Team) {
    return team.pickedUpEntities.map(id => {
        const entity = items.find(item => item.id === id)
        const type = entityTypes.find(et => et.typeId === entity?.type)
        return type?.category
    }).filter(cat => cat === 'ITEM').length
  }
  
  function getSortedTasksByTeamId(team: Team) {
    return team.solvedTasks
      .sort((task1, task2) => task2 - task1);
  }
  
  // Must be consistent
  function coinToss(team: Team) {
    return new Date(team.CreatedAt).getMilliseconds() % 2 === 0 ? 1 : -1;
  }
  
  function compareHighestTask(team1Tasks: number[], team2Tasks: number[]) {
    for (let i = 0; i < team1Tasks.length; i++) {
      if (team1Tasks[i] < team2Tasks[i]) {
        return 1;
      } else if (team1Tasks[i] > team2Tasks[i]) {
        return -1;
      }
    }
    return 0;
  }
  
  function compareTaskCount(team1: Team, team2: Team) {
    return team2.solvedTasks.length - team1.solvedTasks.length;
  }
  
  function compareTotalScores(team1: Team, team2: Team) {
    return team2.score.total - team1.score.total;
  }