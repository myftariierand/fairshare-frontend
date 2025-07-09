import { RootState } from '@/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

type DrawerState = {
    isCreateGroupDrawerOpen: boolean
    isAddTransactionDrawerOpen: boolean
    isAddFriendDrawerOpen: boolean
}

const initialState: DrawerState = {
    isCreateGroupDrawerOpen: false,
    isAddTransactionDrawerOpen: false,
    isAddFriendDrawerOpen: false
}

const drawerSlice = createSlice({
    name: 'drawer',
    initialState,
    reducers: {
        toggleDrawer: (
            state,
            action: PayloadAction<{
                drawer: keyof DrawerState
                status?: boolean
            }>
        ) => {
            state[action.payload.drawer] =
                action.payload.status ?? !state[action.payload.drawer]
        }
    }
})

export const { toggleDrawer } = drawerSlice.actions

export const useDrawerSlice = () => {
    const dispatch = useDispatch()
    const drawerState = useSelector((state: RootState) => state.drawer)

    const toggle = (drawer: keyof DrawerState, status?: boolean) => {
        dispatch(toggleDrawer({ drawer, status }))
    }

    return [drawerState, toggle] as const
}

export default drawerSlice.reducer
