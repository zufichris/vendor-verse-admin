"use client"

import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { createUser } from "@/lib/actions/user.actions"
import { UserRole, Gender } from "@/types/user.types"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { PhoneInput } from "../ui/phone-input"
import { Spinner } from "../ui/spinner"
import { useRouter } from "next/navigation"
import { CreateUserDTO, CreateUserSchema } from "@/lib/validations/user.validation"
import { toast } from "sonner"

export function CreateUserForm() {
  const router = useRouter()

  const [submitting, setSubmitting] = useState(false)

  const form = useForm<CreateUserDTO>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
        dateOfBirth: undefined,
        email: '',
        firstName: '',
        gender: Gender.MALE,
        lastName: '',
        marketingConsent: false,
        password: '',
        phone: '',
        referredBy: '',
        role: UserRole.CUSTOMER
    },
  });

  const onSubmit:SubmitHandler<CreateUserDTO> = async(data)=>{
    try {
      setSubmitting(true)
      await createUser(data)
      form.reset()
    } catch (error:any) {
      console.log(error)
      toast.error(error?.message || 'Unexpected server error')
    }finally{
      setSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the user's basic information and contact details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormDescription>
                        User's first name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormDescription>
                          User's last name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormField
                  control={form.control}
                  name="email"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter valid email address" {...field} />
                      </FormControl>
                      <FormDescription>
                        User's email address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <div className="space-y-2">
              <FormField
                  control={form.control}
                  name="password"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter strong password" {...field} />
                      </FormControl>
                      <FormDescription>
                          User's strong password
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <div className="space-y-2">
              <FormField
                  control={form.control}
                  name="phone"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <PhoneInput placeholder="Enter phone number" defaultCountry="AE" {...field} />
                      </FormControl>
                      <FormDescription>
                        User's phone number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Optional information about the user.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="role"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select name="role" defaultValue={UserRole.CUSTOMER} value={field.value} onValueChange={field.onChange} >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={UserRole.CUSTOMER}>Customer</SelectItem>
                            <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                            <SelectItem value={UserRole.MODERATOR}>Moderator</SelectItem>
                            <SelectItem value={UserRole.SUPPORT}>Support</SelectItem>
                            <SelectItem value={UserRole.VENDOR}>Vendor</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                          Select user's role. Default role: {UserRole.CUSTOMER}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select name="gender" value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Gender.MALE}>Male</SelectItem>
                            <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                            <SelectItem value={Gender.OTHER}>Other</SelectItem>
                            <SelectItem value={Gender.PREFER_NOT_TO_SAY}>Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                          Select user's gender.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>Date of birth</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormDescription>
                          Select user's date of birth.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <div className="space-y-2">
              <FormField
                  control={form.control}
                  name="referredBy"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>Referred By (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter referral code" {...field} />
                      </FormControl>
                      <FormDescription>
                        Referal code of the another user. Must be valid
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <div className="flex items-center space-x-2">
              <FormField
                  control={form.control}
                  name="marketingConsent"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel>Marketing Consent</FormLabel>
                      <FormControl>
                        <Checkbox onCheckedChange={field.onChange} checked={field.value}/>
                      </FormControl>
                      <FormDescription>
                        User consents to receive marketing communications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" disabled={submitting} onClick={router.back}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? <><Spinner /> Creating...</> : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
