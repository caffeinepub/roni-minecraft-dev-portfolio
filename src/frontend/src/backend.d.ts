import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactMessage {
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface GalleryImage {
    id: bigint;
    url: string;
    order: bigint;
    caption: string;
}
export interface backendInterface {
    addImage(url: string, caption: string): Promise<bigint>;
    editImage(id: bigint, url: string, caption: string): Promise<void>;
    getAboutImage(): Promise<string | null>;
    getAllImages(): Promise<Array<GalleryImage>>;
    getAllMessages(): Promise<Array<ContactMessage>>;
    getAllMessagesByName(name: string): Promise<Array<ContactMessage>>;
    getMessageById(id: bigint): Promise<ContactMessage>;
    removeImage(id: bigint): Promise<void>;
    setAboutImage(url: string): Promise<void>;
    submitMessage(name: string, email: string, message: string): Promise<void>;
}
