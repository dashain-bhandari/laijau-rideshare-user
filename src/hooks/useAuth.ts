import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../state/store"

export const useAuth=()=>{
    const {user}=useSelector((state:RootState)=>state.user)

    useEffect(()=>{

    },[])

return {user}
}