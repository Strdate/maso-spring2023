import { Grid, Typography } from "@suid/material";

export default function Guide() {
return (
    <Grid container justifyContent="center">
    <Grid item xs={12} md={8} lg={6}>
        <div style={{margin: '24px 16px', padding: '16px', background: '#ffffff', "border-radius": '5px'}}>
        <Typography variant="h5">Vítej v zadávátku</Typography>
        <p>
            Pokud chceš zadak aukci pro tým, zadej prosím výše jeho číslo. Už
            zobrazené týmy zůstávají v historii na horním panelu pro rychlejší
            přístup. Pokud chceš tým z historie odstranit, stačí ho vybrat a
            kliknout na přeškrtnuté oko vpravo nahoře.<br /><br />

            Klávesové zkratky:<br />
            <b>Esc</b> - Přesune kurzor do políčka pro výběr týmu<br />
            <b>Tab</b> - Přesune kurzor do další aukce<br />
        </p>
        </div>
    </Grid>
    </Grid>
)
}