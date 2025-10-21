import {create} from'zustand'

export const useSEssion = crate((set)=>({
    isAuthed: false,
    nickname:' ',
    setNickname:(name)=>set({nickname:name}),
    login:(nickname)=>set({isAuthed:true,nickanme}),
    logout: ()=>({isAuthed:false,nickname:''}),
}))