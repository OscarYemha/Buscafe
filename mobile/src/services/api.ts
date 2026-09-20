import { CafeSummary } from "../types/CafeSummary";
import { CafeDetail } from "../types/CafeDetail";

const API_URL = 'http://192.168.0.12:3001';

export async function getCafes() 
{
    const response = await fetch(`${API_URL}/cafes`);
    
    if (!response.ok)
    {
        throw new Error(
            'No se pudieron obtener las cafeterías'
        );
    }

    return response.json();
}

export async function getNearbyCafes(
    latitude: number,
    longitude: number
): Promise<CafeSummary[]>
{
    const response = await fetch(
        `${API_URL}/cafes/nearby` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}`
    );

    if (!response.ok)
    {
        throw new Error('No se pudieron obtener las cafeterías cercanas');
    }

    return response.json();
}

export async function getCafeDetails(
    googlePlaceId: string
): Promise<CafeDetail>
{
    const response = await fetch(
        `${API_URL}/cafes/place/` +
        `${encodeURIComponent(googlePlaceId)}`
    );

    if (!response)
    {
        throw new Error(
            'No se pudo obtener el detalle de la cafetería'
        );
    }

    return response.json();
}