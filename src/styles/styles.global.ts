import styled from "styled-components";

export const Content = styled.div`
    max-width: 1120px;
    display: block;
    margin: 0 auto;
    padding: 2rem 6rem;

    .loadMore{
        margin-top: 3.5rem;
        color: var(--pink-800);
        transition: all ease-in-out .2s;

        &:hover {
            filter: brightness(.9);
            cursor: pointer;
        }
    }
    
    .info{
        display: flex;
        justify-content: start;
    }
    .info>div{
        display: flex;
        justify-content: space-around;
        margin-left: 2rem;
    }
    .info>div:first-child{
        margin-left: 0
    }
    .info>div svg{
        margin-right: 5px;
        font-size: 1.2rem;
    }
    

`;


