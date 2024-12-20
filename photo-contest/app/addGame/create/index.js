import { useEffect, useState } from 'react';
import Category from "@/components/category";
import TextInput from '@/components/input/text';
import Loader from '@/components/loader';
import toast from "react-hot-toast";
import { useTranslation } from '@/context/TranslationContext';

export default function CreateGame({ title, setTitle, setActiveCategories }) {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [stateCategories, setStateCategories] = useState({});
    const [loading, setLoading] = useState(false);
    const { dictionary } = useTranslation();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/category');
                const data = await response.json();
                if (response.ok) {
                    const validCategories = data.filter(category => category.title && category.icon && category._id);
                    setCategories(validCategories);
                    setFilteredCategories(validCategories);
                    const initialState = {};
                    validCategories.forEach(category => {
                        initialState[category._id] = true;
                    });
                    setStateCategories(initialState);
                } else {
                    toast.error(data.error);
                }
            } catch (err) {
                toast.error('Error fetching categories');
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const activeCategories = categories.filter(category => stateCategories[category._id]);
        setActiveCategories(activeCategories);
    }, [stateCategories, categories, setActiveCategories]);

    const handleTitle = (e) => {
        setTitle(e.target.value);
    };

    const toggleCategoryState = (id) => {
        setStateCategories(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    return (
        <div className="pt-[21px]">
            {loading && <Loader />}
            <TextInput placeholder={dictionary.enterTitle} value={title} onChange={handleTitle} />
            <div className="grid grid-cols-2 gap-[29px] pt-[21px]">
                {filteredCategories.map((category) => (
                    <Category
                        key={category._id}
                        text={dictionary[category.title]}
                        icon={category.icon}
                        state={stateCategories[category._id]}
                        setState={() => toggleCategoryState(category._id)}
                    />
                ))}
            </div>
        </div>
    );
}