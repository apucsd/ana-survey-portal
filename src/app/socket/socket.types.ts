import { Socket } from 'socket.io';

// ============ SOCKET DATA (attached after auth) ============
export interface SocketData {
    userId: string;
    role: 'USER' | 'DRIVER' | 'SUPERADMIN';
}

// ============ AUTHENTICATED SOCKET ============
export interface AuthenticatedSocket extends Socket {
    data: SocketData;
}

// ============ DRIVER EVENTS ============
export interface DriverJoinOrderPayload {
    orderId: string;
}

export interface DriverLocationUpdatePayload {
    orderId: string;
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
}

export interface DriverOrderStatusPayload {
    orderId: string;
    status: 'ARRIVED' | 'DELIVERING' | 'COMPLETED';
}

// ============ USER EVENTS ============
export interface UserTrackOrderPayload {
    orderId: string;
}

// ============ SERVER EMIT EVENTS ============
export interface DriverLocationBroadcast {
    driverId: string;
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    timestamp: string;
}

export interface OrderStatusBroadcast {
    orderId: string;
    status: string;
    message?: string;
}

export interface SocketErrorPayload {
    message: string;
    code?: string;
}
