import { useParams } from "@solidjs/router";
import useTitle from "/imports/ui/utils/useTitle";
import { createFindOne, createSubscribe } from "solid-meteor-data";
import { Results, ResultsCollection } from "/imports/api/collections/results";
import ManagedSuspense from "../components/managedSuspense";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@suid/material";
import { For, Index, createEffect } from "solid-js";

interface Props { }

export default function ResultsPage(props: Props) {
    useTitle('Výsledky | Maso 2023')
    const params = useParams()

    const loading = createSubscribe('results', () => params.code)
    const [found, resultsFound] = createFindOne(() => loading() ? undefined : ResultsCollection.findOne())
    const results = resultsFound as Results

    const columns = [
        {title: 'Pořadí', prop: 'rank'},
        {title: 'Číslo týmu', prop: 'number'},
        {title: 'Název týmu', prop: 'name', class: 'bold grow'},
        {title: 'Zbylé pohyby', prop: 'money'},
        {title: 'Počet zamrznutí', prop: 'ghostCollisions'},
        {title: 'Sebrané předměty', prop: 'pickedUpItems'},
        {title: 'Skóre za předměty', prop: 'scoreItems'},
        {title: 'Skóre za duchy', prop: 'scoreGhosts'},
        {title: 'Vyřešené příklady', prop: 'solvedTaskCount'},
        {title: 'Celkové skóre', prop: 'scoreTotal', class: 'bold'},
    ]

    const teams = () => results.teams.map(t => ({
        rank: `${t.rank}.`,
        number: t.number,
        name: t.name,
        money: t.money,
        ghostCollisions: t.ghostCollisions,
        pickedUpItems: t.pickedUpItems,
        scoreItems: t.score.items,
        scoreGhosts: t.score.ghosts,
        solvedTaskCount: t.solvedTaskCount,
        scoreTotal: t.score.total
    }))

    return <ManagedSuspense loading={loading()} found={found()}>
        <div class='results-div'>
        <div style={{"font-size": '2.5em', "text-align": 'center', padding: '16px 0'}}>Výsledky</div>
        <Table>
              <TableHead>
                <TableRow class='sticky-table-header'>
                  <Index each={columns}>
                    {(col, index) => <TableCell align={align(index)} class={`cell head-cell ${col().class}`}>{col().title}</TableCell>}
                  </Index>
                </TableRow>
              </TableHead>
              <TableBody>
                <For each={teams()}>
                    {(team) =>
                        <TableRow>
                            <Index each={columns}>
                                {/*@ts-ignore*/}
                                {(col, index) => <TableCell align={align(index)} class={`cell ${col().class}`}>{team[col().prop]}</TableCell>}
                            </Index>
                        </TableRow>}
                </For>
              </TableBody>
            </Table>
        </div>
    </ManagedSuspense>
}

function align(index: number) {
    return index > 2 ? 'right' : 'left'
}