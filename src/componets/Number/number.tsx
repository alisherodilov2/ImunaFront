import React from 'react'

const number = ({ number = 0, residual = 0, count = 0 }: { number: number | string, residual?: number, count?: number }) => {
    var re = '\\d(?=(\\d{' + (residual || 3) + '})+' + (count || 0 > 0 ? '\\.' : '$') + ')';
    return parseFloat(`${number}`).toFixed(Math.max(0, count)).replace(new RegExp(re, 'g'), '$&,');
}

export default number