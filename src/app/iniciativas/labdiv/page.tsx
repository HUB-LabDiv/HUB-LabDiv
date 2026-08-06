import { fetchSubmissions } from "@/app/actions/submissions";
import { LabdivClient } from "./LabdivClient";

export const metadata = {
    title: 'Lab-Div | Iniciativas IFUSP',
    description: 'Laboratório de Divulgação Científica do IFUSP.',
};

export default async function LabdivPage() {
    const res = await fetchSubmissions({
        page: 1,
        limit: 15,
        query: '',
        categories: ['Lab-Div'],
        sort: 'recentes'
    });

    return <LabdivClient posts={res.items.map(item => item.post)} />;
}
