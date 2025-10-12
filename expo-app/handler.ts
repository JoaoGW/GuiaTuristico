

export default function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: 'Hello from Expo App Handler!' });
}