import { jwtDecode } from "jwt-decode";

export interface Payload {
  authorId: number;
  authorized: boolean;
  exp: number;
  firstName: string;
}
export function decodeJwt(token: string) {
  try {
    const decodedToken = jwtDecode(token) as Payload;
    return decodedToken;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}
