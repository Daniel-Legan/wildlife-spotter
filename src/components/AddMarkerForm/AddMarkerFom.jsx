import React from 'react';

function AddMarkerForm({
    submit,
    description,
    animalId,
    animals,
    handleDescriptionChange,
    setAnimalId,
    handleSubmit,
    handleCancel,
}) {
    return (
        <>
            {!submit ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="description">
                            Description:
                            <input
                                required
                                type="text"
                                name="description"
                                placeholder="Enter Description..."
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                        </label>
                        <label htmlFor="animal-select">Animal:</label>
                        <select
                            value={animalId}
                            onChange={(event) => setAnimalId(event.target.value)}
                            required
                        >
                            <option value="" disabled></option>
                            {animals.map((animal) => (
                                <option key={animal.id} value={animal.id}>
                                    {animal.animal}
                                </option>
                            ))}
                        </select>
                        <button>Add Marker</button>
                    </div>
                </form>
            ) : (
                <div>
                    <p>Click on Map to Add Marker</p>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            )}
        </>
    );
}

export default AddMarkerForm;
