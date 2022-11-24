import { styled } from 'solid-styled-components'
import { Typography } from '@suid/material';
import { A } from "@solidjs/router"

const StyledHeader = styled('div')`
  text-align: center;
  margin-top: 24pt;
  margin-bottom: 24pt;

  img {
    width: 130pt;
    margin-bottom: 16pt;
  }
`

export default function Header() {
  return (
    <StyledHeader>
      <img src="/images/MaSo.png" alt="MaSo" />
      <h1>Maso 2023</h1>
      <Typography variant="subtitle1" gutterBottom>
        Hra pro 27. MaSo
      </Typography>
      <div style={{display: 'flex', "flex-direction": 'column', gap: '10px'}}>
        <A href='/login'>Přihlášení</A>
        <A href='/create'>Vytvořit hru</A>
      </div>
    </StyledHeader>
  )
}
