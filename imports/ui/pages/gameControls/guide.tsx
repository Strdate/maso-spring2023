import { Grid, Typography } from "@suid/material";

export default function Guide() {
return (
    <Grid container justifyContent="center">
    <Grid item xs={12} md={8} lg={6}>
        <div style={{margin: '24px 16px', padding: '16px', background: '#ffffff', "border-radius": '5px'}}>
        <Typography variant="h5">Vítej v zadávátku</Typography>
        <p>
            Základní ovládání:<br /><br />

            <b>Šipky / WASD</b> - Pohyb pacmana<br />
            <b>Backspace</b> - Vrátí tah<br />
            <b>B (dlouhý stisk)</b> - Aktivuje žraní<br />
            <b>R</b> - Resetuje limit tahů na zadání<br />
            <b>Esc</b> - Přesunuje kurzor do políčka pro výběr týmu a zpět<br /><br />

            Již zobrazené týmy zůstávají v historii na horním panelu pro rychlejší
            přístup. Pokud chceš tým z historie odstranit, stačí ho vybrat a
            kliknout na přeškrtnuté oko vpravo nahoře.<br /><br />
            
            Ovládání na numerické klávesnici: Mínus - Vrátí tah, Hvězdička (dlouhý stisk) 
            - Aktivuje žraní,<br />Lomítko - Změna týmu
        </p>
        </div>
    </Grid>
    </Grid>
)
}