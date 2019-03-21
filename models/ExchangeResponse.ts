
export interface Attributes {
    version: string;
    encoding: string;
}

export interface Declaration {
    _attributes: Attributes;
}

export interface Attributes2 {
    "xmlns:gesmes": string;
    xmlns: string;
}

export interface GesmesSubject {
    _text: string;
}

export interface GesmesName {
    _text: string;
}

export interface GesmesSender {
    "gesmes:name": GesmesName;
}

export interface Attributes3 {
    time: string;
}

export interface Attributes4 {
    currency: string;
    rate: string;
}

export interface Cube3 {
    _attributes: Attributes4;
}

export interface Cube2 {
    _attributes: Attributes3;
    Cube: Cube3[];
}

export interface Cube {
    Cube: Cube2;
}

export interface GesmesEnvelope {
    _attributes: Attributes2;
    "gesmes:subject": GesmesSubject;
    "gesmes:Sender": GesmesSender;
    Cube: Cube;
}

export interface ExchangeResponse {
    _declaration: Declaration;
    "gesmes:Envelope" : GesmesEnvelope;
}

export class Cube3 {
    _attributes: Attributes4;
    constructor() {
        this._attributes = {
            currency: "EUR",
            rate: ''
        };
    }
}
