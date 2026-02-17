import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { useCreateBugReportMutation } from '@/app/services/bug-report'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

/* -------------------- ZOD SCHEMA -------------------- */

const formSchema = z.object({
    name: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters'),
    severity: z.enum(['CRITICAL', 'MAJOR', 'MINOR', 'COSMETIC']),
    device: z.string().optional()
})

type FormValues = z.infer<typeof formSchema>

/* -------------------- COMPONENT -------------------- */

export const BugReportDialog = () => {
    const [open, setOpen] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            title: '',
            description: '',
            severity: 'MINOR',
            device: navigator.userAgent
        }
    })

    const [createBugReport, { isLoading }] = useCreateBugReportMutation()

    const onSubmit = async (values: FormValues) => {
        try {
            await createBugReport(values).unwrap()

            toast.success('Thank you for helping us improve the app 🙌')
            form.reset()
            setOpen(false)
        } catch (error) {
            toast('Submission failed')
            console.error(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size='sm' variant='outline'>
                    Report a Problem
                </Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                    <DialogTitle>Report a Problem</DialogTitle>
                    <DialogDescription>
                        Please provide details about the issue you encountered.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name (optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Your name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email (optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='email'
                                            placeholder='you@example.com'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Title */}
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Issue Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Brief summary of the problem'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Description / Steps to Reproduce
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='Describe what happened...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Severity */}
                        <FormField
                            control={form.control}
                            name='severity'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Severity</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select severity' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value='CRITICAL'>
                                                Critical – blocks usage
                                            </SelectItem>
                                            <SelectItem value='MAJOR'>
                                                Major – affects key features
                                            </SelectItem>
                                            <SelectItem value='MINOR'>
                                                Minor – small annoyance
                                            </SelectItem>
                                            <SelectItem value='COSMETIC'>
                                                Cosmetic – UI/UX issue
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Device */}
                        <FormField
                            control={form.control}
                            name='device'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Browser / Device / OS</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='e.g., Chrome 122, Windows 11'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type='submit' disabled={isLoading}>
                                {isLoading ? 'Submitting...' : 'Submit Report'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
