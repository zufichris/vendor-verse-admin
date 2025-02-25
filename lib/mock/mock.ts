import { faker } from '@faker-js/faker';
import { AddressSchema, BillingSchema, TUser, UserStatsSchema } from '../types/user';
import { ECurrency, ELanguageCode } from '../types/enum';
import { z } from 'zod';


export const createMockAddress = (): z.infer<typeof AddressSchema> => ({
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
    postalCode: faker.location.zipCode(),
});

export const createMockBilling = (): z.infer<typeof BillingSchema> => ({
    plan: faker.helpers.arrayElement(['Basic', 'Premium', 'Enterprise']),
    status: faker.helpers.arrayElement(['Active', 'Inactive', 'Past Due']),
    lastPayment: faker.date.past(),
    paymentMethod: faker.helpers.arrayElement(['Credit Card', 'PayPal', 'Bank Transfer']),
});

export const createMockUserStats = (): z.infer<typeof UserStatsSchema> => ({
    totalOrders: faker.number.int({ min: 0, max: 100 }),
    totalSpent: faker.number.float({ min: 0, max: 1000, precision: 0.01 }),
    averageOrderValue: faker.number.float({ min: 10, max: 100, precision: 0.01 }),
    favoriteVendors: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
        vendorName: faker.company.name(),
        vendorId: faker.string.uuid(),
    })),
    recentlyViewedProducts: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
        productId: faker.string.uuid(),
        viewedAt: faker.date.recent(),
    })),
    ordersHistory: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
        orderId: faker.string.uuid(),
        totalAmount: faker.number.float({ min: 20, max: 200, precision: 0.01 }),
        orderDate: faker.date.past(),
    })),
});

export const createMockUser = (): TUser => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });

    return {
        id: faker.string.uuid(),
        custId: `CUST0101`,
        email: email,
        password: faker.internet.password(),
        isEmailVerified: faker.datatype.boolean(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        oauth: null,
        tokenPair: null,
        externalProvider: null,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: faker.phone.number(),
        profilePictureUrl: { external: false, url: faker.image.avatar() },
        roles: [faker.helpers.arrayElement(['admin', 'user', 'guest'])],
        isActive: faker.datatype.boolean(),
        dateOfBirth: faker.date.birthdate(),
        gender: faker.person.sex(),
        company: faker.company.name(),
        jobTitle: faker.person.jobTitle(),
        address: createMockAddress(),
        billing: createMockBilling(),
        lastLoginAt: faker.date.recent(),
        totalOrders: faker.number.int({ min: 0, max: 100 }),
        lifetimeValue: faker.number.float({ min: 0, max: 10000, precision: 0.01}),
        tags: faker.helpers.arrayElements(['new', 'vip', 'sale', 'loyal'], faker.number.int({ min: 0, max: 4 })),
        notes: faker.lorem.sentence(),
        preferences: {
            language: faker.helpers.enumValue(ELanguageCode.Enum),
            currency: faker.helpers.enumValue(ECurrency.Enum),
            notificationPreferences: {
                email: faker.datatype.boolean(),
                sms: faker.datatype.boolean(),
                push: faker.datatype.boolean(),
            },
        },
        stats: createMockUserStats(),
    };
};

export const createMockUsers = (count: number = 5): TUser[] => {
    return Array.from({ length: count }, (v, k) => ({ ...createMockUser(), custId: `CUST${k}` }));
};