export interface Sender {
    name: string;
}

export interface Cube3 {
    currency: string;
    rate: string;
}

export interface Cube2 {
    time: string;
    Cube: Cube3[];
}

export interface Cube {
    Cube: Cube2;
}

export interface ExchangeResponse {
    subject: string;
    Sender: Sender;
    Cube: Cube;
}