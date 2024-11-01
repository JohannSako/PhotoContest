// app/api/userdata/route.js

export async function GET() {
    return new Response('this is my data', {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
