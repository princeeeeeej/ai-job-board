import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { UserNotificationSettingsTable } from "@/drizzle/schema";
import { NotificationForm } from "@/features/users/component/NotificationForm";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default function NotificationPage(){
    return (
        <Suspense>
            <SuspendedComponent />
        </Suspense>
    )
}


async function SuspendedComponent(){
    const {userId} = await getCurrentUser()
    if(userId == null) return notFound()

        return (
            <div className="max-w-3xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>
                <Card>
                    <CardContent>
                        <Suspense fallback={<LoadingSpinner/>}>
                            <SuspendedForm userId={userId} />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        )
}

async function SuspendedForm({userId}: {userId : string}){
    const notificationSettings = await getNotificationsSettings(userId)
    return (
        <NotificationForm notificationSettings={notificationSettings}/>
    )
}

async function getNotificationsSettings(userId : string){
    return db.query.UserNotificationSettingsTable.findFirst({
        where: eq(UserNotificationSettingsTable.userId, userId),
        columns : {
            aiPrompt: true,
            newJobEmailNotifications: true
        }
    })
}