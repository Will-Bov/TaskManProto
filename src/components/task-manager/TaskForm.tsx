"use client";

// ... (keep all previous imports and interfaces the same)

export function TaskForm({ onSubmit, initialTask }: TaskFormProps) {
  // ... (keep all existing state and functions the same)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... (keep all other form fields the same) */}

      <div>
        <Label>Category</Label>
        <Select 
          value={category} 
          onValueChange={setCategory}
          open={isAddingCategory ? false : undefined}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="group">
                <div className="flex justify-between items-center w-full">
                  <span className="flex-1">{cat}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-2 opacity-0 group-hover:opacity-100"
                    onClick={(e) => handleDeleteCategory(cat, e)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </SelectItem>
            ))}
            {/* ... (keep the add category section the same) */}
          </SelectContent>
        </Select>

        {/* ... (keep the new category input section the same) */}
      </div>

      <Button type="submit" className="w-full">
        {initialTask ? "Update Task" : "Add Task"}
      </Button>
    </form>
  );
}