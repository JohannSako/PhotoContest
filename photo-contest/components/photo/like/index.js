export default function Like({ like, setLike }) {

    const switchLike = () => {
        if (like)
            setLike(false);
        else
            setLike(true);
    }

    if (like) {
        return (<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" onClick={switchLike}>
            <g filter="url(#filter0_d_66_2430)">
                <path d="M36.6667 14.77C36.6724 17.3346 35.6844 19.8017 33.91 21.6533C29.8417 25.8717 25.895 30.27 21.6767 34.3333C20.7083 35.25 19.1733 35.2167 18.2483 34.2583L6.09 21.655C2.415 17.845 2.415 11.695 6.09 7.88667C6.95857 6.975 8.00323 6.2492 9.16065 5.75329C10.3181 5.25737 11.5641 5.00167 12.8233 5.00167C14.0825 5.00167 15.3286 5.25737 16.486 5.75329C17.6434 6.2492 18.6881 6.975 19.5567 7.88667L20 8.34333L20.4417 7.88667C21.3113 6.97624 22.3561 6.25116 23.5133 5.75507C24.6704 5.25898 25.916 5.00214 27.175 5C29.7083 5 32.13 6.04 33.9083 7.88667C35.6833 9.73807 36.672 12.2052 36.6667 14.77Z" fill="#B70909" stroke="#B70909" strokeWidth="2.5" strokeLinejoin="round" />
            </g>
            <defs>
                <filter id="filter0_d_66_2430" x="-2" y="-1" width="44" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="1" />
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_66_2430" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_66_2430" result="shape" />
                </filter>
            </defs>
        </svg>);
    } else {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" onClick={switchLike}>
                <g filter="url(#filter0_d_66_2324)">
                    <path d="M36.6667 14.77C36.6724 17.3346 35.6844 19.8017 33.91 21.6533C29.8417 25.8717 25.895 30.27 21.6767 34.3333C20.7083 35.25 19.1733 35.2167 18.2483 34.2583L6.09 21.655C2.415 17.845 2.415 11.695 6.09 7.88667C6.95857 6.975 8.00323 6.2492 9.16065 5.75329C10.3181 5.25737 11.5641 5.00167 12.8233 5.00167C14.0825 5.00167 15.3286 5.25737 16.486 5.75329C17.6434 6.2492 18.6881 6.975 19.5567 7.88667L20 8.34333L20.4417 7.88667C21.3113 6.97624 22.3561 6.25116 23.5133 5.75507C24.6704 5.25898 25.916 5.00214 27.175 5C29.7083 5 32.13 6.04 33.9083 7.88667C35.6833 9.73807 36.672 12.2052 36.6667 14.77Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                </g>
                <defs>
                    <filter id="filter0_d_66_2324" x="-2" y="-1" width="44" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="1" />
                        <feGaussianBlur stdDeviation="1" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_66_2324" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_66_2324" result="shape" />
                    </filter>
                </defs>
            </svg>
        );
    }
};