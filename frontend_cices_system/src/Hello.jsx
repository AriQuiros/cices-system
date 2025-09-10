import './App.css';

import { useEffect, useState } from "react"
import axios from "axios"

export default function Hello() {
    const [msg, setMsg] = useState("cargando...")

    useEffect(() => {
        axios.get("/api/hello")
            .then(r => setMsg(r.data.msg))
            .catch(() => setMsg("error al conectar"))
    }, [])

    return <div className="content"><h1>{msg}</h1></div>
}
