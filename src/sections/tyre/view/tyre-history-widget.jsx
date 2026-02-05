import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

export default function TyreHistory({ ...other }) {
    return (
        <Card {...other}>
            <CardHeader title="Tyre History" />
            <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 5 }}>
                    History tracking coming soon...
                </Typography>
            </CardContent>
        </Card>
    );
}
