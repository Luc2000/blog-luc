import styled from "styled-components";

export const MainPost = styled.div`
    margin-top: 2rem;
    
    h2{
        transition: all ease-in-out .2s;
    }

    a{
        text-decoration: unset;
        color: unset;
    }

    p {
        color:var(--gray-100);
    }

    .subtitle {
        margin: 1rem 0 1.5rem 0;
    }

    h2:hover{
        color: var(--pink-800);
    }
`;