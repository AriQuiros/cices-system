export function Pagination({
                               page,
                               totalPages,
                               totalElements,
                               onPageChange
                           }) {

    // no renderiza si solo hay 1 página
    if (!totalPages || totalPages <= 1) return null;

    return (
        <div>
            <span>
                Total: {totalElements}
            </span>

            <div>
                <button
                    disabled={page === 0}
                    onClick={() => onPageChange(page - 1)}
                >
                    Anterior
                </button>

                <span>
                    Página {page + 1} de {totalPages}
                </span>

                <button
                    disabled={page >= totalPages - 1}
                    onClick={() => onPageChange(page + 1)}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}