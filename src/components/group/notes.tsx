import { useRef } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable, isSortable } from '@dnd-kit/react/sortable'
import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers'
import { RestrictToElement } from '@dnd-kit/dom/modifiers'

import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel
} from '@/components/ui/field'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GripVerticalIcon, NotebookIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'

import {
    useGetTasksQuery,
    useAddTaskMutation,
    useUpdateTaskMutation,
    useReorderTasksMutation,
    Task,
    useDeleteTaskMutation
} from '@/app/services/task'
import { Route } from '@/routes/_auth/g/$group'
import clsx from 'clsx'

const kebabCase = (string: string) =>
    string
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase()

const Notes = () => {
    const { group: groupId } = Route.useParams()
    const { user } = Route.useRouteContext()

    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [inputValue, setInputValue] = useState('')

    const { data: items = [] } = useGetTasksQuery(groupId)
    const [addTask] = useAddTaskMutation()
    const [updateTask] = useUpdateTaskMutation()
    const [deleteTask] = useDeleteTaskMutation()
    const [reorderTasks] = useReorderTasksMutation()

    const handleAdd = () => {
        const text = inputValue.trim()
        if (!text) return
        addTask({ groupId, text })
        setInputValue('')
        inputRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAdd()
        }
    }

    return (
        <div className='space-y-2'>
            <Field>
                <Input
                    placeholder='Add a task, press enter'
                    ref={inputRef}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </Field>
            {!items.length ? (
                <div className='grid place-items-center mt-12 text-muted-foreground space-y-2'>
                    <NotebookIcon />
                    <span className='text-sm font-medium'>No Tasks</span>
                </div>
            ) : (
                <Card>
                    <DragDropProvider
                        onDragEnd={event => {
                            if (event.canceled) return
                            const { source } = event.operation
                            if (isSortable(source)) {
                                const { initialIndex, index } = source
                                if (initialIndex !== index) {
                                    const reordered = [...items]
                                    const [removed] = reordered.splice(
                                        initialIndex,
                                        1
                                    )
                                    reordered.splice(index, 0, removed)
                                    reorderTasks({
                                        groupId,
                                        orderedIds: reordered.map(t => t.id)
                                    })
                                }
                            }
                        }}
                    >
                        <CardContent
                            ref={containerRef}
                            className='space-y-2 p-6'
                        >
                            <ul className='space-y-2'>
                                {items.map((item, index) => (
                                    <SortableItem
                                        key={item.id}
                                        index={index}
                                        container={containerRef}
                                        item={item}
                                        userId={user.id}
                                        onToggle={done =>
                                            updateTask({
                                                groupId,
                                                taskId: item.id,
                                                done
                                            })
                                        }
                                        onDelete={() =>
                                            deleteTask({
                                                taskId: item.id,
                                                groupId: groupId
                                            })
                                        }
                                    />
                                ))}
                            </ul>
                        </CardContent>
                    </DragDropProvider>
                </Card>
            )}
        </div>
    )
}

export default Notes

function SortableItem({
    item,
    index,
    container,
    userId,
    onToggle,
    onDelete
}: {
    item: Task
    index: number
    userId: string
    container: React.RefObject<HTMLDivElement | null>
    onToggle: (done: boolean) => void
    onDelete: () => void
}) {
    const { id, text, done, createdBy } = item
    const [element, setElement] = useState<Element | null>(null)
    const handleRef = useRef<HTMLButtonElement | null>(null)

    useSortable({
        id,
        index,
        element,
        handle: handleRef,
        modifiers: [
            RestrictToElement.configure({ element: () => container.current }),
            RestrictToVerticalAxis
        ]
    })

    return (
        <li ref={setElement}>
            <Field orientation='horizontal'>
                <Checkbox
                    id={kebabCase(text)}
                    name={kebabCase(text)}
                    checked={done}
                    onCheckedChange={checked => onToggle(!!checked)}
                />
                <FieldContent className='gap-0'>
                    <FieldLabel
                        htmlFor={kebabCase(text)}
                        className={clsx(done && 'line-through')}
                    >
                        {text}
                    </FieldLabel>
                    <FieldDescription>
                        {userId === createdBy.id ? 'You' : createdBy.name}
                    </FieldDescription>
                </FieldContent>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => {
                        onDelete()
                    }}
                >
                    <TrashIcon />
                </Button>
                <Button variant='ghost' size='icon' ref={handleRef}>
                    <GripVerticalIcon />
                </Button>
            </Field>
        </li>
    )
}
