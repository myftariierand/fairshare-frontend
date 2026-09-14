// features/tasks/tasksApi.ts
import { api } from '@/app/api'

export interface Task {
    id: string
    text: string
    done: boolean
    position: number
    groupId: string
    createdById: string
    createdBy: {
        id: string
        name: string
    }
}

export const tasksApi = api.injectEndpoints({
    endpoints: builder => ({
        getTasks: builder.query<Task[], string>({
            query: groupId => `/groups/${groupId}/tasks`,
            providesTags: (result, _err, groupId) =>
                result
                    ? [
                          ...result.map(t => ({
                              type: 'Task' as const,
                              id: t.id
                          })),
                          { type: 'Task' as const, id: `LIST-${groupId}` }
                      ]
                    : [{ type: 'Task' as const, id: `LIST-${groupId}` }]
        }),

        addTask: builder.mutation<Task, { groupId: string; text: string }>({
            query: ({ groupId, text }) => ({
                url: `/groups/${groupId}/tasks`,
                method: 'POST',
                body: { text }
            }),
            async onQueryStarted(
                { groupId, text },
                { dispatch, queryFulfilled }
            ) {
                const tempId = `temp-${Date.now()}`
                const patch = dispatch(
                    tasksApi.util.updateQueryData(
                        'getTasks',
                        groupId,
                        draft => {
                            draft.unshift({
                                id: tempId,
                                text,
                                done: false,
                                position: (draft[0]?.position ?? 0) - 1,
                                groupId,
                                createdById: 'me',
                                createdBy: { id: 'me', name: 'Me' }
                            })
                        }
                    )
                )
                try {
                    const { data: created } = await queryFulfilled
                    dispatch(
                        tasksApi.util.updateQueryData(
                            'getTasks',
                            groupId,
                            draft => {
                                const idx = draft.findIndex(
                                    t => t.id === tempId
                                )
                                if (idx !== -1) draft[idx] = created
                            }
                        )
                    )
                } catch {
                    patch.undo()
                }
            }
        }),
        updateTask: builder.mutation<
            Task,
            { groupId: string; taskId: string; text?: string; done?: boolean }
        >({
            query: ({ groupId, taskId, ...body }) => ({
                url: `/groups/${groupId}/tasks/${taskId}`,
                method: 'PATCH',
                body
            }),
            async onQueryStarted(
                { groupId, taskId, ...changes },
                { dispatch, queryFulfilled }
            ) {
                const patch = dispatch(
                    tasksApi.util.updateQueryData(
                        'getTasks',
                        groupId,
                        draft => {
                            const task = draft.find(t => t.id === taskId)
                            if (task) Object.assign(task, changes)
                        }
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    patch.undo()
                }
            }
        }),
        reorderTasks: builder.mutation<
            Task[],
            { groupId: string; orderedIds: string[] }
        >({
            query: ({ groupId, orderedIds }) => ({
                url: `/groups/${groupId}/tasks/reorder`,
                method: 'PUT',
                body: { orderedIds }
            }),
            async onQueryStarted(
                { groupId, orderedIds },
                { dispatch, queryFulfilled }
            ) {
                const patch = dispatch(
                    tasksApi.util.updateQueryData(
                        'getTasks',
                        groupId,
                        draft => {
                            draft.sort(
                                (a, b) =>
                                    orderedIds.indexOf(a.id) -
                                    orderedIds.indexOf(b.id)
                            )
                        }
                    )
                )
                try {
                    await queryFulfilled
                } catch {
                    patch.undo()
                }
            }
        }),
        deleteTask: builder.mutation<void, { taskId: string; groupId: string }>(
            {
                query: ({ groupId, taskId }) => ({
                    url: `/groups/${groupId}/tasks/${taskId}`,
                    method: 'DELETE'
                }),
                async onQueryStarted(
                    { groupId, taskId },
                    { dispatch, queryFulfilled }
                ) {
                    const patch = dispatch(
                        tasksApi.util.updateQueryData(
                            'getTasks',
                            groupId,
                            draft => {
                                const idx = draft.findIndex(
                                    t => t.id === taskId
                                )
                                if (idx !== -1) draft.splice(idx, 1)
                            }
                        )
                    )
                    try {
                        await queryFulfilled
                    } catch {
                        patch.undo()
                    }
                }
            }
        )
    })
})

export const {
    useGetTasksQuery,
    useAddTaskMutation,
    useUpdateTaskMutation,
    useReorderTasksMutation,
    useDeleteTaskMutation
} = tasksApi
