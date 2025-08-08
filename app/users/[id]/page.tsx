import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    Edit,
    Key,
    UserCheck,
    UserX,
    Shield,
    Mail,
    Phone,
    Calendar,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getUserById } from "@/lib/actions/user.actions";
import { UserStatus, UserRole } from "@/types/user.types";
import { UserDetailsSkeleton } from "@/components/users/user-details-skeleton";

interface UserPageProps {
    params: Promise<{
        id: string;
    }>;
}

const statusColors = {
    [UserStatus.ACTIVE]: "bg-green-100 text-green-800",
    [UserStatus.INACTIVE]: "bg-gray-100 text-gray-800",
    [UserStatus.SUSPENDED]: "bg-yellow-100 text-yellow-800",
    [UserStatus.PENDING_VERIFICATION]: "bg-blue-100 text-blue-800",
    [UserStatus.BANNED]: "bg-red-100 text-red-800",
    [UserStatus.DELETED]: "bg-red-100 text-red-800",
};

const roleColors = {
    [UserRole.CUSTOMER]: "bg-blue-100 text-blue-800",
    [UserRole.ADMIN]: "bg-purple-100 text-purple-800",
    [UserRole.MODERATOR]: "bg-orange-100 text-orange-800",
    [UserRole.SUPPORT]: "bg-green-100 text-green-800",
    [UserRole.VENDOR]: "bg-yellow-100 text-yellow-800",
};

async function UserContent({ params }: UserPageProps) {
    const { id } = await params;
    const result = await getUserById(id);

    if (!result.success) {
        notFound();
    }
    const user = result.data;
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16">
                        <Image
                            src={user.profileImage || "/placeholder.svg?height=64&width=64"}
                            alt={`${user.firstName} ${user.lastName}`}
                            fill
                            className="rounded-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-muted-foreground">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                            <Badge className={roleColors[user.role]}>{user.role}</Badge>
                            <Badge className={statusColors[user.status]}>
                                {user.status.replace("_", " ")}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" asChild>
                        <Link href={`/users/${user.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <Button variant="outline">
                        <Key className="mr-2 h-4 w-4" />
                        Reset Password
                    </Button>
                    <Button variant="outline">
                        {user.status === UserStatus.ACTIVE ? (
                            <>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                            </>
                        ) : (
                            <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    First Name
                                </div>
                                <div>{user.firstName}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Last Name
                                </div>
                                <div>{user.lastName}</div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-sm font-medium">{user.email}</div>
                                <div className="flex items-center space-x-2">
                                    <div
                                        className={`h-2 w-2 rounded-full ${user.isEmailVerified ? "bg-green-500" : "bg-red-500"}`}
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        {user.isEmailVerified ? "Verified" : "Not verified"}
                                    </span>
                                    {user.emailVerifiedAt && (
                                        <span className="text-sm text-muted-foreground">
                                            on {formatDate(user.emailVerifiedAt)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {user.phone && (
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium">{user.phone}</div>
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className={`h-2 w-2 rounded-full ${user.isPhoneVerified ? "bg-green-500" : "bg-red-500"}`}
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            {user.isPhoneVerified ? "Verified" : "Not verified"}
                                        </span>
                                        {user.phoneVerifiedAt && (
                                            <span className="text-sm text-muted-foreground">
                                                on {formatDate(user.phoneVerifiedAt)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {user.dateOfBirth && (
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium">Date of Birth</div>
                                    <div className="text-sm text-muted-foreground">
                                        {formatDate(user.dateOfBirth)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {user.gender && (
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Gender
                                </div>
                                <div className="capitalize">
                                    {user.gender.replace("_", " ")}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-sm font-medium">
                                    Two-Factor Authentication
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">
                                User ID
                            </div>
                            <div className="font-mono text-sm">{user.id}</div>
                        </div>

                        <div>
                            <div className="text-sm font-medium text-muted-foreground">
                                Referral Code
                            </div>
                            <div className="font-mono text-sm">{user.referralCode}</div>
                        </div>

                        {user.referredBy && (
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Referred By
                                </div>
                                <div className="font-mono text-sm">{user.referredBy}</div>
                            </div>
                        )}

                        <div>
                            <div className="text-sm font-medium text-muted-foreground">
                                Account Created
                            </div>
                            <div className="text-sm">{formatDate(user.createdAt)}</div>
                        </div>

                        <div>
                            <div className="text-sm font-medium text-muted-foreground">
                                Last Updated
                            </div>
                            <div className="text-sm">{formatDate(user.updatedAt)}</div>
                        </div>

                        {user.lastLogin && (
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Last Login
                                </div>
                                <div className="text-sm">{formatDate(user.lastLogin)}</div>
                            </div>
                        )}

                        {user.lastActiveAt && (
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Last Active
                                </div>
                                <div className="text-sm">{formatDate(user.lastActiveAt)}</div>
                            </div>
                        )}

                        {user.lastPasswordChange && (
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Password Last Changed
                                </div>
                                <div className="text-sm">
                                    {formatDate(user.lastPasswordChange)}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* User Metrics */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Total Orders
                                </div>
                                <div className="text-2xl font-bold">
                                    {user.metrics.totalOrders}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Total Spent
                                </div>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(user.metrics.totalSpent)}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Average Order Value
                                </div>
                                <div className="text-lg font-semibold">
                                    {formatCurrency(user.metrics.averageOrderValue)}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Lifetime Value
                                </div>
                                <div className="text-lg font-semibold">
                                    {formatCurrency(user.metrics.lifetimeValue)}
                                </div>
                            </div>
                        </div>

                        {user.metrics.lastOrderDate && (
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Last Order
                                </div>
                                <div className="text-sm">
                                    {formatDate(user.metrics.lastOrderDate)}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Loyalty Points
                                </div>
                                <div className="text-lg font-semibold">
                                    {user.metrics.loyaltyPoints}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Referrals
                                </div>
                                <div className="text-lg font-semibold">
                                    {user.metrics.referralsCount}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Reviews
                                </div>
                                <div className="text-lg font-semibold">
                                    {user.metrics.reviewsCount}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Average Rating
                                </div>
                                <div className="text-lg font-semibold">
                                    {user.metrics.averageRating > 0
                                        ? `${user.metrics.averageRating}/5`
                                        : "N/A"}
                                </div>
                            </div>
                        </div>

                        {user.metrics.favoriteCategories.length > 0 && (
                            <div>
                                <div className="text-sm font-medium text-muted-foreground mb-2">
                                    Favorite Categories
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {user.metrics.favoriteCategories.map((category) => (
                                        <Badge key={category} variant="secondary">
                                            {category}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Communication Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Communication Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(user.preferences.communications).map(
                            ([channel, prefs]) => (
                                <div key={channel}>
                                    <div className="text-sm font-medium capitalize mb-2">
                                        {channel}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span>Marketing</span>
                                            <div
                                                className={`h-2 w-2 rounded-full ${prefs.marketing ? "bg-green-500" : "bg-red-500"}`}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Order Updates</span>
                                            <div
                                                className={`h-2 w-2 rounded-full ${prefs.orderUpdates ? "bg-green-500" : "bg-red-500"}`}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Promotions</span>
                                            <div
                                                className={`h-2 w-2 rounded-full ${prefs.promotions ? "bg-green-500" : "bg-red-500"}`}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Newsletter</span>
                                            <div
                                                className={`h-2 w-2 rounded-full ${prefs.newsletter ? "bg-green-500" : "bg-red-500"}`}
                                            />
                                        </div>
                                    </div>
                                    {channel !== "phone" && <Separator className="mt-2" />}
                                </div>
                            ),
                        )}

                        <div className="pt-2">
                            <div className="text-sm font-medium text-muted-foreground mb-2">
                                Shopping Preferences
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Currency</span>
                                    <span>{user.preferences.shopping.currency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Language</span>
                                    <span>{user.preferences.shopping.language}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Timezone</span>
                                    <span>{user.preferences.shopping.timezone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Theme</span>
                                    <span className="capitalize">
                                        {user.preferences.display.theme}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default async function UserPage({ params }: UserPageProps) {
    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/users">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Users
                    </Link>
                </Button>
            </div>

            <Suspense fallback={<UserDetailsSkeleton />}>
                <UserContent params={params} />
            </Suspense>
        </div>
    );
}
