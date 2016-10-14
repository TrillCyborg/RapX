import React, { Text, View, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Button from '../Input/Button';

const buttonText = 'The Button Text';

describe('<Button/>', () => {
  it('should render correct components', () => {
    const wrapper = shallow(<Button>{buttonText}</Button>);
    expect(wrapper.find(TouchableOpacity)).to.have.length(1);
    expect(wrapper.find(Text)).to.have.length(1);
    expect(wrapper.find(Text).props().children).to.equal(buttonText);
  });

  it('if disabled should render <View /> instead of <TouchableOpacity />', () => {
    const wrapper = shallow(<Button disabled>{buttonText}</Button>);
    expect(wrapper.find(TouchableOpacity)).to.have.length(0);
    expect(wrapper.find(View)).to.have.length(1);
    expect(wrapper.find(Text)).to.have.length(1);
    expect(wrapper.find(Text).props().children).to.equal(buttonText);
  });

  it('should handle button presses', () => {
    const onPress = sinon.spy();
    const wrapper = shallow(<Button onPress={onPress}>{buttonText}</Button>);
    wrapper.simulate('press');
    expect(onPress.calledOnce).to.equal(true);
  });
});
