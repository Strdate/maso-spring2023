import { useNavigate } from "@solidjs/router"
import { ListItemButton, ListItemText } from "@suid/material"

interface Props {
    header: string,
    content: string,
    link: string
}

function SectionLink(props: Props) {
  const navigate = useNavigate()
  return (
    <ListItemButton
        aria-label={props.content}
        style={{
            'text-decoration': 'none',
        }}
        onClick={() => navigate(props.link)}
    >
      <ListItemText primary={props.header} secondary={props.content} />
    </ListItemButton>
  )
}

export default SectionLink
