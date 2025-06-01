// Product event interfaces for communication via RabbitMQ
export interface ProductEvent {
    productId: string;
    userId: string;
    timestamp?: string;
}

export interface ProductCreatedEvent extends ProductEvent {
    product: {
        name: string;
        price: number;
        description?: string;
    };
}

export interface ProductUpdatedEvent extends ProductEvent {
    updates: {
        name?: string;
        price?: number;
        description?: string;
    };
}

export interface ProductDeletedEvent extends ProductEvent {
    reason?: string;
}
