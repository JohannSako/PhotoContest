import Text from "@/components/text";
import PropTypes from 'prop-types';

export default function Day({ day = 1, state = 'EMPTY', image = '', onClick = undefined }) {
    const isImage = state.includes('IMAGE');
    const isToday = state.includes('TODAY');
    const textColor = state.includes('EMPTY') ? '#000000' : '#FFFFFF';
    const textShadow = state.includes('IMAGE') ? '0px 1px 2px rgba(0, 0, 0, 0.50)' : 'none';
    const backgroundColor = state.includes('IMAGE') ? 'transparent' : 'white';
    const active = isImage ? 'active:opacity-50' : '';

    return (
        <div
            className={`relative flex w-[46px] h-[58px] flex-shrink-0 rounded-[10px] justify-center items-center ${active}`}
            style={{ backgroundColor }}
            onClick={isImage ? onClick : undefined}
        >
            {isImage && (
                <img
                    src={image}
                    alt=""
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-[10px]"
                />
            )}
            {isToday && (
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" className="absolute">
                    <circle cx="15" cy="15" r="15" fill="#5DB075" />
                </svg>
            )}
            <div className="absolute flex items-center justify-center">
                <Text size="14px" weight="500" color={textColor} style={{ textShadow }}>
                    {day}
                </Text>
            </div>
        </div>
    );
}

Day.propTypes = {
    day: PropTypes.oneOf(Array.from({ length: 31 }, (_, i) => i + 1)).isRequired,
    state: PropTypes.oneOf(['EMPTY', 'IMAGE', 'TODAY']).isRequired,
    image: function(props, propName, componentName) {
        if (props.state.includes('IMAGE') && !props[propName]) {
            return new Error(`Invalid prop \`${propName}\` supplied to \`${componentName}\`. When state is "IMAGE", an \`${propName}\` must be provided.`);
        }
    }
};
