export type InsuranceType = "LIABILITY" | "HOUSEHOLD" | "HEALTH"

export type PolicyStatus = 'ACTIVE' | 'PENDING' | 'CANCELLED' | 'DROPPED_OUT'

export type Customer = {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
};

export type TableRow = {
    id: string;
    customer: Customer;
    provider: string;
    insuranceType: InsuranceType;
    status: PolicyStatus;
    startDate: string;
    endDate: string;
    createdAt: string;
};
