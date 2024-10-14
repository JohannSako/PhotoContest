import Text from "@/components/text";
import PropTypes from 'prop-types';

export default function Day({ day = 1, state = 'EMPTY', image = '', onClick = undefined }) {
    const textColor = state === 'EMPTY' ? '#000000' : '#FFFFFF';
    const textShadow = state === 'IMAGE' ? '0px 1px 2px rgba(0, 0, 0, 0.50)' : 'none';
    const backgroundImage = state === 'IMAGE' ? `url(${image})` : 'none';
    const backgroundColor = state === 'IMAGE' ? 'transparent' : 'white';

    const active = state == 'IMAGE' ? 'active:opacity-50' : '';

    return (
        <div className={`relative flex w-[46px] h-[58px] flex-shrink-0 rounded-[10px] justify-center items-center ${active}`} style={{ backgroundImage, backgroundColor, backgroundSize: 'cover', backgroundPosition: 'center' }} onClick={state == 'IMAGE' ? onClick : undefined}>
            {state === 'TODAY' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" className="absolute">
                    <circle cx="15" cy="15" r="15" fill="#5DB075" />
                </svg>
            )}
            <div className="absolute flex items-center justify-center">
                <Text size="14px" weight="500" color={textColor} style={{ textShadow }}>{day}</Text>
            </div>
        </div>
    );
};

Day.propTypes = {
    day: PropTypes.oneOf(Array.from({ length: 31 }, (_, i) => i + 1)).isRequired,
    state: PropTypes.oneOf(['EMPTY', 'IMAGE', 'TODAY']).isRequired,
    image: function(props, propName, componentName) {
        if (props.state === 'IMAGE' && !props[propName]) {
            return new Error(`Invalid prop \`${propName}\` supplied to \`${componentName}\`. When state is "IMAGE", an \`${propName}\` must be provided.`);
        }
    }
};