import { useEffect, useState } from "react"
import axios from "axios"

export default function Hello() {
    const [msg, setMsg] = useState("cargando...")

    useEffect(() => {
        axios.get("/api/hello")
            .then(r => setMsg(r.data.msg))
            .catch(() => setMsg("error al conectar"))
    }, [])

    return <h1>{msg}</h1>
}
